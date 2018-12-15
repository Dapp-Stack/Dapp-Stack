import { Structure } from "@dapp-stack/environment";
import * as fs from "fs-extra"
import * as path from "path";
import { parse, Location, ASTNode } from "solidity-parser-antlr";
import { EventLog } from 'web3/types'

import { decrypt } from "./eventId";
import { Injector } from "./injector";
import { Instrumenter } from "./instrumenter";
import { InstrumentWalker } from "./instrumentWalker";
import { Suppressor } from "./suppressor";
import { BranchType, Coverage } from "./types";

enum EventEnum {
  statement = "__StatementCoverage",
  branch = "__BranchCoverage",
  function = "__FunctionCoverage",
}

let id = 0;
function nextId() {
  id++;
  return id;
}

export class ContractCoverage {
  public id: number;
  public coverage: Coverage;
  public source: string;
  public filepath: string;
  public realFilepath: string;
  private ast: ASTNode;

  constructor(public name: string) {
    this.id = nextId();
    this.realFilepath = path.join(Structure.contracts.realSrc, name);
    this.filepath = path.join(Structure.contracts.src, name);
    this.source = fs.readFileSync(this.filepath, "utf-8");

    this.coverage = {
      b: {},
      branchMap: {},
      code: this.source,
      f: {},
      fnMap: {},
      l: {},
      path: this.realFilepath,
      s: {},
      statementMap: {},
    };
    this.ast = parse(this.source, { loc: true, range: true });
  }

  public instrument() {
    new Suppressor(this).process();
    const instrumenter = new Instrumenter(this);
    const instrumentWalker = new InstrumentWalker(instrumenter);
    instrumentWalker.walk(this.ast);
    const injector = new Injector(this);
    instrumenter.getInjectionPoints().forEach(injector.process.bind(injector));
    fs.writeFileSync(this.filepath, this.source);
  }

  public updateCoverage(events: EventLog[]) {
    const self = this
    events.filter(this.filterCoverageEvent).forEach((event) => {
      const value = parseInt(event.returnValues[0], 10);
      const { contractId, injectionPointId, locationIdx } = decrypt(value);

      if (contractId !== self.id) {
        return;
      }

      switch (event.event) {
        case "__StatementCoverage": {
          this.coverage.s[injectionPointId] += 1;
          const statement = this.coverage.statementMap[injectionPointId];
          this.coverage.l[statement.start.line] += 1;
          break;
        }
        case "__FunctionCoverage": {
          this.coverage.f[injectionPointId] += 1;
          const fn = this.coverage.fnMap[injectionPointId];
          this.coverage.l[fn.line] += 1;
          break;
        }
        case "__BranchCoverage": {
          this.coverage.b[injectionPointId][locationIdx] += 1;
          break;
        }
      }
    });
  }

  public addStatement(location: Location) {
    const coverageId = this.getNewCoverageId(this.coverage.statementMap);
    this.coverage.statementMap[coverageId] = location;
    this.coverage.s[coverageId] = 0;
    this.coverage.l[location.start.line] = 0;
    return coverageId;
  }

  public addBranch(line: number, type: BranchType, locations: Location[]) {
    const coverageId = this.getNewCoverageId(this.coverage.branchMap);
    this.coverage.branchMap[coverageId] = {
      line,
      locations,
      type,
    };
    this.coverage.b[coverageId] = locations.map(() => 0);
    this.coverage.l[line] = 0;
    return coverageId;
  }

  public addFunction(location: Location, name: string) {
    const coverageId = this.getNewCoverageId(this.coverage.fnMap);
    const line = location.start.line;
    this.coverage.fnMap[coverageId] = {
      line,
      loc: location,
      name,
    };
    this.coverage.f[coverageId] = 0;
    this.coverage.l[line] = 0;
    return coverageId;
  }

  private getNewCoverageId(object: { [key: string]: any }) {
    const lastId = Object.keys(object).map(Number).sort((a, b) => b - a)[0] || 0;
    return lastId + 1;
  }

  private filterCoverageEvent(event: EventLog) {
    return [EventEnum.function, EventEnum.branch, EventEnum.statement].includes(event.event as EventEnum);
  }

}