const mongoose = require("mongoose");
const CalendarWorking = new mongoose.Schema({
    _id: {
        type: Number
    },
    userId: {
        type: Number
    },
    hospitalId: {
        type: Number
    },
    carlendarWorking_week: {
        type: {
            week: {
                type: Number,
                require: true,

            },
            year: {
                type: Number,
                require: true,
            },
            t2: [{
                type: {
                    time_start: {
                        type: Number
                    }, 
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t3: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t4: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t5: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t6: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t7: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }],
            t8: [{
                type: {
                    time_start: {
                        type: Number
                    },
                    time_end: {
                        type: Number
                    },
                    Current_patient: {
                        type: Number
                    },
                    Max_patient: {
                        type: Number
                    },
                    default: null
                }
            }]
        }
    }

});

module.exports = mongoose.model("CalendarWorking", CalendarWorking);