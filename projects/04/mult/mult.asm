// This file is part of www.nand2tetris.org
// and the book "The Elements of Computing Systems"
// by Nisan and Schocken, MIT Press.
// File name: projects/04/Mult.asm

// Multiplies R0 and R1 and stores the result in R2.
// (R0, R1, R2 refer to RAM[0], RAM[1], and RAM[2], respectively.)

// Put your code here.

@2
M=0 // R2 = 0

@counter
M=0 // counter = 0

(LOOP)
@counter
D=M // D = counter
@0
D=D-M // D = counter - R0
@END
D;JGE

@1
D=M // D = R1
@2 // R2 = R1 + R2
M=D+M

@counter
M=M+1 // i++
@LOOP
0;JMP

(END)
@END
0;JMP


// @R2
// M=0        // R2 = 0 (since R1 >= 1)

// @counter
// M=0        // counter = 0

// (LOOP)
// @counter
// D=M        // D = counter
// @R1
// D=D-M;     // D = counter - R1
// @END
// D;JGE      // if counter > R1 goto END
// @counter
// M=M+1      // counter ++
// @R0
// D=M        // D = R0
// @R2
// M=M+D      // R2 = R2 + R0
// @LOOP
// 0;JMP
// (END)
// @END
// 0;JMP
