export function createRace(gates) {
  return {
    gates,
    nextGate: 0,
    countdown: 3.0,
    time: 0,
    started: false,
    finished: false,
  };
}

export function resetRace(race) {
  race.nextGate = 0;
  race.countdown = 3.0;
  race.time = 0;
  race.started = false;
  race.finished = false;
}

export function updateRace(race, carPosition, dt) {
  if (!race.started && !race.finished) {
    race.countdown -= dt;
    if (race.countdown <= 0) {
      race.countdown = 0;
      race.started = true;
    }
    return;
  }

  if (race.finished) {
    return;
  }

  race.time += dt;

  const gate = race.gates[race.nextGate];
  if (gate && carPosition.distanceTo(gate.position) < gate.radius) {
    race.nextGate += 1;
    if (race.nextGate >= race.gates.length) {
      race.finished = true;
    }
  }
}

export function isRaceActive(race) {
  return race.started && !race.finished;
}
