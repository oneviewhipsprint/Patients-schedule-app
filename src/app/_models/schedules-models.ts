export class Chair {
    chairId?: any;
    chairName?: any;
}

export class Shift {
    shiftId?: any;
    shiftName?: any;
    shiftTime?: any;
}

export class Clinic {
    chairs?: Chair[];
    shifts?: Shift[]
}

export class Schedule {
    scheduleId?: any;
    patientId?: any;
    clinicId?: any;
    chairId?: any;
    shiftId?: any;
    shiftDate?: any;
}

export class WaitList {
    scheduleId?: any;
    patientId?: any;
    clinicId?: any;
    chairId?: any;
    shiftId?: any;
    shiftDate?: any;
    status?: any;
}