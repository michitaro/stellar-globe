from itertools import count

seq = count(1)

def uid():
  return next(seq)
