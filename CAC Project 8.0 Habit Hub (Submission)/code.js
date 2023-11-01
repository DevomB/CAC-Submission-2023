var HabitSelected, CameFromScreen;
var DateNum = new Date().getDay();
var DaysOfTheWeek = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
var Day = DaysOfTheWeek[DateNum];
var TodayHabitList = [];
var terms = {};
terms[Day] = true;
// Displays on TodaysHabits
ShowTodaysHabits();
//Creates and Records Habits 
onEvent("CreateAHabit", "click", function() {
  setScreen("CreateAHabitScreen");
});
onEvent("CreateAHabitButton", "click", function() {
  hideElement("CreateAHabitButton");
  setTimeout(function() {
    showElement("CreateAHabitButton");
  }, 1500);
  createRecord("Habit Data", 
  {name:getText("CAHNameInput"),
  description:getText("CAHHabitDesc"),
  time:getText("CAHTimeInput"),
  sunday:getChecked("CAHSunCheck"),
  monday:getChecked("CAHMonCheck"),
  tuesday:getChecked("CAHTuesCheck"),
  wednesday:getChecked("CAHWedCheck"),
  thursday:getChecked("CAHThurCheck"),
  friday:getChecked("CAHFriCheck"),
  saturday:getChecked("CAHSatCheck")}, 
  function() {
    setScreen("HabitCreatedScreen");
    //Set things to blank
    setText("CAHNameInput", "");
    setText("CAHHabitDesc", "");
    setProperty("CAHTimeInput", "index", 0);
    setChecked("CAHSunCheck", false);
    setChecked("CAHMonCheck", false);
    setChecked("CAHTuesCheck", false);
    setChecked("CAHWedCheck", false);
    setChecked("CAHThurCheck", false);
    setChecked("CAHFriCheck", false);
    setChecked("CAHSatCheck", false);
  });
});
onEvent("HabitCreatedButton", "click", function() {
  setScreen("MainScreen");
});
//Edit and Delete a Habit code 
onEvent("EditAHabit", "click", function( ) {
  CameFromScreen = "EditAHabit";
  setScreen("SelectAHabit");
  setProperty("SelectHabitDropdown", "options", getColumn("Habit Data", "name"));
  if (getProperty("SelectHabitDropdown", "index")==-1) {
    showElement("SelectAHabitInstructions");
    hideElement("SelectAHabitLabel");
  }
});
onEvent("deleteAHabit", "click", function( ) {
  CameFromScreen = "DeleteAHabit";
  setScreen("SelectAHabit");
  setProperty("SelectHabitDropdown", "options", getColumn("Habit Data", "name"));
  if (getProperty("SelectHabitDropdown", "index")==-1) {
    showElement("SelectAHabitInstructions");
    hideElement("SelectAHabitLabel");
  }
});
onEvent("SelectAHabitButton", "click", function() {
  HabitSelected = getText("SelectHabitDropdown");
  if (CameFromScreen=="EditAHabit") {
    setScreen("EditAHabitScreen");
    readRecords("Habit Data", { name: HabitSelected }, function(records) {
    if (records.length > 0) {
      var SelectedHabit = records[0];
      setScreen("EditAHabitScreen");
      //Set Data from the Habit in Data
      setText("EAHHabitName", SelectedHabit.name);
      setText("EAHHabitDesc", SelectedHabit.description);
      setText("EAHTimeInput", SelectedHabit.time);
      setChecked("EAHSunCheck", SelectedHabit.sunday);
      setChecked("EAHMonCheck", SelectedHabit.monday);
      setChecked("EAHTuesCheck", SelectedHabit.tuesday);
      setChecked("EAHWedCheck", SelectedHabit.wednesday);
      setChecked("EAHThursCheck", SelectedHabit.thursday);
      setChecked("EAHFriCheck", SelectedHabit.friday);
      setChecked("EAHSatCheck", SelectedHabit.saturday);
    }
  });
  } else if (CameFromScreen=="DeleteAHabit") {
    setScreen("DeleteAHabitScreen");
    setProperty("HabitBeingDeleted", "text", HabitSelected);
  }
});
// Debugging Edit a Habit as of right now
onEvent("EditAHabitButton", "click", function() {
  readRecords("Habit Data", {name:HabitSelected}, function(records) {
    if (records.length > 0) {
      var HabitToUpdateID = records[0].id;
      updateRecord("Habit Data", 
      {id: HabitToUpdateID,
       name: getText("EAHHabitName"),
       description: getText("EAHHabitDesc"),
       time: getText("EAHTimeInput"),
       sunday: getChecked("EAHSunCheck"),
       monday: getChecked("EAHMonCheck"),
       tuesday: getChecked("EAHTuesCheck"),
       wednesday: getChecked("EAHWedCheck"),
       thursday: getChecked("EAHThursCheck"),
       friday: getChecked("EAHFriCheck"),
       saturday: getChecked("EAHSatCheck")}, 
       function() {
        setScreen("HabitUpdatedScreen");
      });
    }
  });
});
onEvent("HabitUpdatedHomeButton", "click", function( ) {
  setScreen("MainScreen");
});
onEvent("DeleteHabitButton", "click", function() {
  readRecords("Habit Data", {name:HabitSelected}, function(records) {
      if (records.length > 0) {
        var HabitToDeleteID = records[0].id;
        deleteRecord("Habit Data", {id:HabitToDeleteID}, function() {
          hideElement("DeleteHabitButton");
          setTimeout(function() {
            showElement("DeleteHabitButton");
          }, 1500);
          setScreen("HabitDeletedScreen");
        });
      }
    });
});
onEvent("HabitDeletedButton", "click", function( ) {
  setScreen("MainScreen");
});
// Back Buttons on the app
onEvent("SelectAHabitBackButton", "click", function( ) {
  setScreen("MainScreen");
});
onEvent("DeleteAHabitBackButton", "click", function( ) {
  setScreen("MainScreen");
});
//Here we add functionality to the today habit element.
onRecordEvent("Habit Data", function(record, eventType) {
  ShowTodaysHabits();
},true);
function ShowTodaysHabits() {
  var terms = {};
  terms[Day] = true;
  readRecords("Habit Data", terms, function (records) {
    TodayHabitList = [];
    for (var i = 0; i < records.length; i++) {
      TodayHabitList.push(records[i].name + " at " + records[i].time);
    }
    if (TodayHabitList.length === 0) {
      setText("TodaysHabits", "Today's Habits:"+"\n"+"No Habits scheduled for today");
    } else {
      setText("TodaysHabits", "Today's Habits:\n" + TodayHabitList.join("\n"));
    }
  });
}
