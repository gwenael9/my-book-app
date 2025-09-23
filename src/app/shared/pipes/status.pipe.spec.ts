import { StatusPipe } from './status.pipe';

describe('StatusPipe', () => {
  let pipe: StatusPipe;

  beforeEach(() => {
    pipe = new StatusPipe();
  });

  it('should transform "free" to { label: "Disponible", severity: "success" }', () => {
    expect(pipe.transform('free')).toEqual({ label: 'Disponible', severity: 'success' });
  });

  it('should transform "unavailable" to { label: "Indisponible", severity: "danger" }', () => {
    expect(pipe.transform('unavailable')).toEqual({ label: 'Indisponible', severity: 'danger' });
  });

  it('should transform "reserved" to { label: "Réservé", severity: "warning" }', () => {
    expect(pipe.transform('reserved')).toEqual({ label: 'Réservé', severity: 'warning' });
  });
});
