const GamemodeName = {
    X01: 'X01',
    Cricket: 'Cricket',
}

const FirstBest = {
    First: 'First to',
    Best: 'Best of',
}

const SetsLegs = {
    Sets: 'Sets',
    Legs: 'Legs',
}

const CheckInOut = {
  Straight: 'straight',
  Double: 'double',
  Triple: 'triple',
  Master: 'master'
}

class X01Settings {
  type = 'X01'
  constructor(startScore, checkIn, checkOut) {
    this.startScore = startScore
    this.checkIn = checkIn
    this.checkOut = checkOut
  }
}

export { GamemodeName, FirstBest, SetsLegs, CheckInOut, X01Settings }
