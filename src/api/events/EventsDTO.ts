export enum EventsStatusEnum {
    IN_PROGRESS = "IN_PROGRESS",
    NEW = "NEW",
    TOOK = "TOOK"
}

export interface EventsQuery {
    readonly status: string;
}

export interface AccessLogsPromiseData {
    readonly id: string;
    readonly direction: string;
    readonly file: FileProps
    readonly session: SessionProps;
    readonly gate: {
        readonly id: string;
        readonly key: string;
    }
    readonly vehicle: VehicleProps
}

export interface VehicleProps {
    readonly id: string;
    readonly licenseNumber: string
}

export interface FileProps {
    readonly id: string;
    readonly name: string;
    readonly url: string;
}

export interface SessionProps {
    readonly id: string;
    readonly isPaid: boolean;
    readonly isTook: boolean;
    readonly status: string;
    readonly canExit: string;
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
    readonly vehicle: VehicleProps
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