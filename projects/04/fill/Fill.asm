// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Fill.asm

// Runs an infinite loop that listens to the keyboard input.
// When a key is pressed (any key), the program blackens the screen,
// i.e. writes "black" in every pixel;
// the screen should remain fully black as long as the key is pressed.
// When no key is pressed, the program clears the screen, i.e. writes
// "white" in every pixel;
// the screen should remain fully clear as long as no key is pressed.

// Put your code here.

(LOOP)
  @KBD
  D=M
  @BLACK
  D;JGT
  @WHITE
  D;JLE

  (BLACK)
    @color
    M=-1
    @DRAW
    0;JMP

  (WHITE)
    @color
    M=0
    @DRAW
    0;JMP

  (DRAW)
    @8192 // (512 * 256)/16 = 8192 / count of whole words
    D=A
    @count
    M=D
      (DRAW_WARD)
        @count
        D=M
        @index // index = count
        M=D-1 // 0 < index < 8191
        @SCREEN
        D=A
        @index // index = SCREEN + index
        M=D+M

        @color // Drawing
        D=M
        @index
        A=M
        M=D

        @count // count = count - 1
        D=M-1
        M=D

        @DRAW_WARD
        D;JGT // draw next word
@LOOP
0;JMP

