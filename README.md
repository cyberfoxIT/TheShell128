# TheShell128

A command line interface for the Commodore 128
This is an MS-DOS like command line interface for the Commodore 128 equipped with at least a Commodore drive and a REU of at least 512K.

## What "TheShell128" can do.
 - Support for 10 aliases;
 - Support for local variables;
 - Support up to 4 drives;
 - Copy or delete files with wildcard support;
 - Rename files (no wildcard support);
 - Format, relabel or copy disk;
 - Show file content;
 - Read or write d64/d71/d81 images;
 - Read directory and copy MS-DOS files with burst support to and from a CBM (no wildcard support, no subdirectories support and only with at least a 1571);
 - Can make an external command resident for the shell;
 - Can execute batch files;
 - Can mount or dismount on UltimateII cart;
 - Can get or put files to and from a remote host with a simple .js server;
 - Can copy to and from UltimateII cart USB sticks/CBM peripheral;
 - Can get, set or sync the internal clock with the one on the UltimateII cart;
 - Can go back to the shell once gone to basic;
 - Can use any bank of the REU;

## What "TheShell128" can't do.
Everything not listed in this document! :)

## How it work
The shell system disk is an autoboot disk, so you can simply insert it into the drive 8: and turn on the c128.
The program "warmboot.prg" will be loaded and executed automatically, and if it find a previous installation on the REU,
it will boot from there, otherwise will load the "loader.prg" for a cold boot.
The boot process by default will install the shell in the first 4 banks of the REU.

Once finished loading, you should find yourself in an MS-DOS like environment, with a prompt and a cursor.

Here you can use one of the following internal commands:

 - PROMPT       Change the current prompt string;
 - VER          Show the current shell version;
 - DATE	  	Set or show the current date;
 - TIME	  	Set or show the current date;
 - BREAK	Set or show the break flag (used for interrupt batch files);
 - ECHO	  	Show the current echo flag or show a string on the screen;
 - ECHO.	Show an empty line;
 - COPY  	Copy files from a drive to another;
 - SET		Set an environment variable;
 - IF 	  	Process a condition;
 - HISTORY	Show command history;
 - CLS		Clear the screen;
 - STATUS	Show the current status of a drive;
 - PAUSE	Make a pause and wait for a key;
 - DEL		Delete files (wildcard supported);
 - TYPE		Show the contents of a file;
 - RENAME	Rename a file (wildcard not supported);
 - DIR		Show the directory of a disk;
 - CMD		Send a command to a drive;
 - BASIC	Go to basic, for go back to the shell, simply write GOBACK, or "go" + SHIFT-B;
 - VOL		Show the name of a disk;
 - RESIDENT	Make an external command resident in REU;
 - ALIAS	Create an alias;
 - WHY		Show an explanation for the last error code, if set;
 - EXIT		Exit the Shell;
 - LABEL	Rename a disk;

Anything that contains a blank must be enclosed inside double quotes, so for example, if you want to copy the file 
named "Test file" from the drive 8: to drive 9:, you can write:

COPY "8:Test file" 9:

Or you want to run a program on the current drive named "Test Program", you should write:

"TEST PROGRAM"
	  
If a typed command is not recognized as an internal or resident one, the shell will try to load it from the current drive.

You can specify the type of the file you're referring by adding:
 - P for PRG;
 - S for SEQ;
 - R for REL;
 
so for example if you want to search on a disk for all the SEQUENTIAL files only, you can write something like:

  DIR *,s
  
This command will show only the sequential files.
In the same way you can copy all the sequential files by simply writing:
  COPY *,s 9:

If you want to use a special non printable char, you can print the char 169 followed by a 3 digit number indicating 
the ascii code of the character you want to print.

## Local variables

In the shell, like the MSDOS, you can set a local variable using the SET command.

	SET VARNAME=VARVALUE

If the value of the variable contains any space, all the parameter must be inside double quotes, so if you want to 
set a variable name "VarName" with a value of "Test value", you should write:

	SET "VarName=Test value"

If you want to refer to any defined variable you should specify a the variable name enclosed inside a '%', so for example,
if you want to copy the file defined in the variable "VarName" to the drive 9:, you should write:

	COPY %VarName% 9:

If you want to clear a variable, you can write something like this:

	SET VarName=

There's some system environment variables that are readonly.
	RC       	Is the return code of the last command;
	CD			Is the current drive;
	COLS		Is the number of columns of the current display;
	SPEED		Is the current cpu speed;
	VMODE		Is the current video display (VDC or VIC);
	
