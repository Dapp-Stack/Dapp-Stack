import { execAsync } from 'async-child-process';
import * as promisify from 'es6-promisify';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';
import * as publishRelease from 'publish-release';

import { constants } from './constants';
import { configs } from './utils/configs';
import { utils } from './utils/utils';

const publishReleaseAsync = promisify(publishRelease);
const generatedDocsDirectoryName = 'generated_docs';

export interface PostpublishConfigs {
  cwd: string;
  packageName: string;
  version: string;
  assets: string[];
  docPublishConfigs: DocPublishConfigs;
}

export interface DocPublishConfigs {
  fileIncludes: string[];
  s3BucketPath: string;
  s3StagingBucketPath: string;
}

export const postpublishUtils = {
  generateConfig(packageJSON: any, tsConfigJSON: any, cwd: string): PostpublishConfigs {
    if (_.isUndefined(packageJSON.name)) {
      throw new Error('name field required in package.json. Cannot publish release notes to Github.');
    }
    if (_.isUndefined(packageJSON.version)) {
      throw new Error('version field required in package.json. Cannot publish release notes to Github.');
    }
    const postpublishConfig = _.get(packageJSON, 'config.postpublish', {});
    const postpublishConfigs: PostpublishConfigs = {
      cwd,
      packageName: packageJSON.name,
      version: packageJSON.version,
      assets: _.get(postpublishConfig, 'assets', []),
      docPublishConfigs: {
        fileIncludes: [
          ...tsConfigJSON.include,
          ..._.get(postpublishConfig, 'docPublishConfigs.extraFileIncludes', []),
        ],
        s3BucketPath: _.get(postpublishConfig, 'docPublishConfigs.s3BucketPath'),
        s3StagingBucketPath: _.get(postpublishConfig, 'docPublishConfigs.s3StagingBucketPath'),
      },
    };
    return postpublishConfigs;
  },
  async runAsync(packageJSON: any, tsConfigJSON: any, cwd: string): Promise<void> {
    if (configs.IS_LOCAL_PUBLISH) {
      return;
    }
    const postpublishConfigs = postpublishUtils.generateConfig(packageJSON, tsConfigJSON, cwd);
    await postpublishUtils.publishReleaseNotesAsync(
      postpublishConfigs.packageName,
      postpublishConfigs.version,
      postpublishConfigs.assets,
    );
    if (
      !_.isUndefined(postpublishConfigs.docPublishConfigs.s3BucketPath) ||
      !_.isUndefined(postpublishConfigs.docPublishConfigs.s3StagingBucketPath)
    ) {
      utils.log('POSTPUBLISH: Release successful, generating docs...');
      await postpublishUtils.generateAndUploadDocsAsync(
        postpublishConfigs.cwd,
        postpublishConfigs.docPublishConfigs.fileIncludes,
        postpublishConfigs.version,
        postpublishConfigs.docPublishConfigs.s3BucketPath,
      );
    } else {
      utils.log(`POSTPUBLISH: No S3Bucket config found for ${packageJSON.name}. Skipping doc JSON generation.`);
    }
  },
  async publishDocsToStagingAsync(packageJSON: any, tsConfigJSON: any, cwd: string): Promise<void> {
    const postpublishConfigs = postpublishUtils.generateConfig(packageJSON, tsConfigJSON, cwd);
    if (_.isUndefined(postpublishConfigs.docPublishConfigs.s3StagingBucketPath)) {
      utils.log('config.postpublish.docPublishConfigs.s3StagingBucketPath entry in package.json not found!');
      return;
    }

    utils.log('POSTPUBLISH: Generating docs...');
    await postpublishUtils.generateAndUploadDocsAsync(
      postpublishConfigs.cwd,
      postpublishConfigs.docPublishConfigs.fileIncludes,
      postpublishConfigs.version,
      postpublishConfigs.docPublishConfigs.s3StagingBucketPath,
    );
  },
  async publishReleaseNotesAsync(packageName: string, version: string, assets: string[]): Promise<void> {
    const notes = postpublishUtils.getReleaseNotes(packageName, version);
    const releaseName = postpublishUtils.getReleaseName(packageName, version);
    const tag = postpublishUtils.getTag(packageName, version);
    postpublishUtils.adjustAssetPaths(assets);
    utils.log('POSTPUBLISH: Releasing ', releaseName, '...');
    await publishReleaseAsync({
      token: constants.githubPersonalAccessToken,
      owner: '0xProject',
      repo: '0x-monorepo',
      tag,
      name: releaseName,
      notes,
      draft: false,
      prerelease: false,
      reuseRelease: true,
      reuseDraftOnly: false,
      assets,
    });
  },
  getReleaseNotes(packageName: string, version: string): string {
    const packageNameWithNamespace = packageName.replace('@0xproject/', '');
    const changelogJSONPath = path.join(
      constants.monorepoRootPath,
      'packages',
      packageNameWithNamespace,
      'CHANGELOG.json',
    );
    const changelogJSON = fs.readFileSync(changelogJSONPath, 'utf-8');
    const changelogs = JSON.parse(changelogJSON);
    const latestLog = changelogs[0];
    // We sanity check that the version for the changelog notes we are about to publish to Github
    // correspond to the new version of the package.
    if (version !== latestLog.version) {
      throw new Error('Expected CHANGELOG.json latest entry version to coincide with published version.');
    }
    let notes = '';
    _.each(latestLog.changes, change => {
      notes += `* ${change.note}`;
      if (change.pr) {
        notes += ` (#${change.pr})`;
      }
      notes += `\n`;
    });
    return notes;
  },
  getTag(packageName: string, version: string): string {
    return `${packageName}@${version}`;
  },
  getReleaseName(subPackageName: string, version: string): string {
    const releaseName = `${subPackageName} v${version}`;
    return releaseName;
  },
  // Asset paths should described from the monorepo root. This method prefixes
  // the supplied path with the absolute path to the monorepo root.
  adjustAssetPaths(assets: string[]): string[] {
    const finalAssets: string[] = [];
    _.each(assets, (asset: string) => {
      finalAssets.push(`${constants.monorepoRootPath}/${asset}`);
    });
    return finalAssets;
  },
  adjustFileIncludePaths(fileIncludes: string[], cwd: string): string[] {
    const fileIncludesAdjusted = _.map(fileIncludes, fileInclude => {
      let includePath = _.startsWith(fileInclude, './')
        ? `${cwd}/${fileInclude.substr(2)}`
        : `${cwd}/${fileInclude}`;

      // HACK: tsconfig.json needs wildcard directory endings as `/**/*`
      // but TypeDoc needs it as `/**` in order to pick up files at the root
      if (_.endsWith(includePath, '/**/*')) {
        // tslint:disable-next-line:custom-no-magic-numbers
        includePath = includePath.slice(0, -2);
      }
      return includePath;
    });
    return fileIncludesAdjusted;
  },
  async generateAndUploadDocsAsync(
    cwd: string,
    fileIncludes: string[],
    version: string,
    S3BucketPath: string,
  ): Promise<void> {
    const fileIncludesAdjusted = postpublishUtils.adjustFileIncludePaths(fileIncludes, cwd);
    const projectFiles = fileIncludesAdjusted.join(' ');
    const jsonFilePath = `${cwd}/${generatedDocsDirectoryName}/index.json`;
    const result = await execAsync(
      `JSON_FILE_PATH=${jsonFilePath} PROJECT_FILES="${projectFiles}" yarn docs:json`,
      {
        cwd,
      },
    );
    if (!_.isEmpty(result.stderr)) {
      throw new Error(result.stderr);
    }
    const fileName = `v${version}.json`;
    utils.log(`POSTPUBLISH: Doc generation successful, uploading docs... as ${fileName}`);
    const s3Url = S3BucketPath + fileName;
    await execAsync(`S3_URL=${s3Url} yarn upload_docs_json`, {
      cwd,
    });
    // Remove the generated docs directory
    await execAsync(`rm -rf ${generatedDocsDirectoryName}`, {
      cwd,
    });
    utils.log(`POSTPUBLISH: Docs uploaded to S3 bucket: ${S3BucketPath}`);
  },
};
