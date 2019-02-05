export default interface Unit {
  http;
  path;

  getUnits();
  getUnit(unit: string);
}
