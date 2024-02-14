export enum EventsStatusEnum {
    IN_PROGRESS = "IN_PROGRESS",
    NEW = "NEW",
    TOOK = "TOOK"
}

export interface EventsQuery {
    readonly status: string;
}

export interface SessionPromiseData {
    readonly ecanExit: boolean;
    readonly createdAt: string;
    readonly enterData: string;
    readonly fileId: string;
    readonly vehicleId: string;
    readonly file: {
        id: string;
    };
    readonly id: string;
    readonly isNeeded: boolean;
    readonly isPaid: boolean;
    readonly isTook: boolean;
    readonly status: EventsStatusEnum;
    readonly updatedAt: string;
    readonly vehicle: {
        id: string;
        readonly plateNumber: string;
    }
}

export interface EventSessionServicePromiseData {
    readonly countItem: number;
    readonly countTime: number;
    readonly countVolume: number;
    readonly countWeight: number;
    readonly id: string;
    readonly isNeeded: string;
    readonly isPaid: string;
    readonly name: string;
    readonly payDate: string;
    readonly price: number;
    readonly serviceId: string;
    readonly sessionId: string;
    readonly status: EventsStatusEnum;
    readonly tookDate: string;
    readonly totalPrice: number;
}

export interface ServicesPromiseData {
    readonly id: string;
    readonly isPrimary: boolean;
    readonly name: string;
    readonly price: number;
    readonly priority: number;
    readonly type: string;
    readonly unitItem: string;
    readonly unitTime: string;
    readonly unitVolume: string;
    readonly unitWeight: string;
}

export interface ServiceBody {
    readonly  name: string;
    readonly price: number;
    readonly unitItem: string;
    readonly unitTime: string;
    readonly unitWeight: string;
    readonly unitVolume: string;
    readonly isPrimary?: boolean;
    readonly priority: number;
    readonly type: string;
}