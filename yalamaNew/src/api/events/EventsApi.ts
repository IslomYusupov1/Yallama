import { BaseApi } from "../BaseApi";
import {
  EventSessionServicePromiseData,
  EventsQuery, ServiceBody,
  ServicesPromiseData,
  SessionPromiseData
} from "@/api/events/EventsDTO";

export class EventsApi extends BaseApi {
  public auth(json: { phone: string, password: string }): Promise<{accessToken: string, refreshToken: string}> {
    return this.post(`auth/login`, { json: json });
  }
  public getEventsList(query: EventsQuery): Promise<{data: SessionPromiseData[]}> {
    return this.get(`sessions`, { query: query });
  }
  public getEventDetails(id: string): Promise<SessionPromiseData> {
    return this.get(`sessions/${id}`);
  }
  public createPlate(json : { plateNumber: string }): Promise<{id: string}> {
    return this.post(`vehicles`, { json: json })
  }
  public getFile(): Promise<{data: [{ id: string, name: string }]}> {
    return this.get(`files`)
  }
  public createSession(json: { fileId: string, plateNumber: string, enterDate: Date }): Promise<{data: [{ id: string, name: string }]}> {
    return this.post(`sessions`, { json: json })
  }
  public getEventSessionServices(query: {sessionId: string, limit: number}): Promise<{ data: EventSessionServicePromiseData[], totalCount: number }> {
    return this.get(`session-service`, { query: query })
  }
  public getEventSessionServicesTotalPrice(sessionId: string): Promise<{ totalPrice: number }> {
    return this.get(`sessions/${sessionId}/calculate`)
  }
  public deleteServiceSession(sessionId: string) {
    return this.delete(`session-service/${sessionId}`)
  }
  public createServiceSession(json: { serviceId: string, sessionId: string, countItem?: number, countTime?: number, countWeight?: number, countVolume?: number}) {
    return this.post(`session-service`, { json: json })
  }
  public editServiceSession(id: string, json: { serviceId: string, sessionId: string, countItem?: number, countTime?: number, countWeight?: number, countVolume?: number}) {
    return this.patch(`session-service/${id}`, { json: json })
  }
  public getAllServices(limit: number): Promise<{ data: ServicesPromiseData[] }> {
    return this.get(`services?sort[priority]=asc&limit=${limit}`)
  }
  public deleteService(id: string) {
    return this.delete(`services/${id}`)
  }
  public editService(id: string, json: ServiceBody) {
    return this.patch(`services/${id}`, { json: json })
  }
  public createService(json: ServiceBody) {
    return this.post(`services`, { json: json })
  }
  public serviceTook(serviceId: string) {
    return this.patch(`session-service/${serviceId}/took`)
  }
}
