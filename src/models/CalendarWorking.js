import mongoose from "mongoose";
const CalendarWorking = new mongoose.Schema({
    carlendarWorking_ID: {
        type: Number
    },
    carlendarWorking_userID: {
        type: Number
    },
    carlendarWorking_userName: {
        type: String
    },
    carlendarWorking_hospitalId: {
        type: Number
    },
    carlendarWorking_week: {
        type: {
            Current_patient: {
                type: Number
            },
            Max_patient: {
                type: Number
            },
            Time_working: {
                type: Date
            }
        }
    }

});

module.exports = mongoose.model("CalendarWorking", CalendarWorking);