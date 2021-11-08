# Proxet tournament 2021 (JS)
## Briefing
You are a part of a developer team who is tasked with making an online game about battles between teams of fighting vehicles.
Your  task today is to implement an algorithm for automatic matchmaking - compiling teams for an online battle.
You need to select 9 players for each of two opposing teams with the longest waiting time in the lobby, and each team should contain 3 vehicles of each of 3 possible vehicle types.

## Technical task
### Team generator
You should use the ``generateTeams`` function to generate teams for a battle.  
You can find it in the `/src/Proxet.Tournament/generateTeams.ts` file.  
You should implement your algorithm in the body of this function.  
`export const generateTeams = (filePath: string): { team1: string[]; team2: string[] } => {`.  
This function receives a file name with waiting statistics and vehicle types for players. And you will need to return two arrays with player names.

### Statistics File format
There will be a text file with 3 tab-delimited values:  
1. User Name (string)  
1. Wait time in seconds (int)  
1. Vehicle type (int 1,2,3)  

### Testing
There is a test that will ensure that you have found the best team. Your task is to make sure the test passes.  
Also, there is a pipeline that runs this test in a docker; Make sure you don't break the docker configuration, otherwise we won't be able to validate the results.

## How to submit
1. Make a fork of this repo.  
1. Do the changes necessary for the `npm test` command to pass.  
1. Submit a Pull Request to the repo. Please submit your PR only when you're sure that it's correct. A testing pipeline runs automatically when a PR is created. If we have more than one pipeline associated with you - we'll take a random one.

## Notes
1. We'll run the pipelines to calculate the execution time, so please ensure that your code is fast.
1. We'll read the code, so please keep it clean and readable. Please add comments to your code where necessary.
1. Good luck!
