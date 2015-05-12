# Object Vs Task
### Description
Mechanical Turk Experiment with psiTurk that examines object representation vs. task representation

### Quick Start
1. Install requisite elements. You can see my ReadMe on [Getting Started with PsiTurk](https://github.com/danieljwilson/Bandit-mechanicalTurk/blob/master/README.md).
2. Test locally. 
  * Make sure that you have updated the __config.txt__ file to write to your local MySQL database
  * Make sure that MySQL is running (try `mysql.server start` from the command line)
  * Launch psiTurk from the project folder on your local machine
  * Turn server on (`server on`)
  * run `debug` in sandbox mode
  * finish a run through to make sure that data is being saved to the MySQL file (check with a program like [Sequel Pro](http://www.sequelpro.com/))
3. Upload to remote server (if everything is working).
  * `ssh` into server
  * `rsync` project into clean folder on server
  * Make sure to update the __config.txt__ file to write to your server's MySQL database
  * Make sure MySQL is running on your server
  * Launch psiTurk from project folder on server
  * Turn server on and create an actual hit (`hit create`) in sandbox mode
  * Navigate to sandbox link and test to see that the experiment runs correctly AND saves to your server's MySQL file
  * Switch from sandbox mode to live mode to run the actual experiment
