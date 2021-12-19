type Symbol = string;
type Address = number;

export class SymbolTable {
  table: Record<Symbol, Address> = {};

  addEntry(symbol: Symbol, address: Address): void {
    this.table[symbol] = address;
  }

  contains(symbol: Symbol): boolean {
    return this.table[symbol] !== undefined;
  }

  getAddress(symbol: Symbol): Address {
    return this.table[symbol];
  }
}
