export type TruckStatus = 'on_trip' | 'available' | 'maintenance' | 'idle'
export type DriverStatus = 'on_trip' | 'available' | 'off_duty'
export type TripStatus = 'planned' | 'in_transit' | 'delivered' | 'settled'

export interface Truck {
  id: string
  plate: string
  model: string
  capacityTons: number
  status: TruckStatus
  fitnessExpiry: string
  insuranceExpiry: string
  lastServiceKm: number
  odometerKm: number
}

export interface Driver {
  id: string
  name: string
  phone: string
  licenceNo: string
  licenceExpiry: string
  homeBase: string
  status: DriverStatus
  assignedTruckId: string | null
  experienceYears: number
}

export interface Trip {
  id: string
  truckId: string
  driverId: string
  origin: string
  destination: string
  cargo: string
  status: TripStatus
  departureDate: string
  etaDate: string
  freightInr: number
  dieselInr: number
  tollInr: number
  advanceInr: number
  distanceKm: number
}

export interface Expense {
  id: string
  tripId: string | null
  category: 'diesel' | 'toll' | 'maintenance' | 'salary' | 'other'
  description: string
  amountInr: number
  date: string
}

export interface FinanceSummary {
  monthLabel: string
  revenueInr: number
  dieselInr: number
  tollInr: number
  otherExpenseInr: number
  netInr: number
}
