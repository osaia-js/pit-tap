import { Component, OnInit, signal, computed } from '@angular/core';
import {
  FLEET, SERVICES, PITSTOP_BASE, HUK_DISCOUNT, VIN_PARAM,
  computeStatus, Vehicle, StatusResult, ServiceStatus,
} from './data';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly FLEET = FLEET;
  readonly SERVICES = SERVICES;
  readonly HUK_DISCOUNT = HUK_DISCOUNT;
  readonly demoVins = Object.keys(FLEET);

  readonly vin = signal<string | null>(null);
  readonly isDemoMode = computed(() => this.vin() === null);
  readonly isNotFound = computed(() => this.vin() !== null && !FLEET[this.vin()!]);

  readonly demoVin = signal<string>(Object.keys(FLEET)[0]);

  readonly displayVehicle = computed<Vehicle | null>(() => {
    if (this.isDemoMode()) return FLEET[this.demoVin()] ?? null;
    const v = this.vin();
    return v ? (FLEET[v] ?? null) : null;
  });

  readonly displayVin = computed<string | null>(() =>
    this.isDemoMode() ? this.demoVin() : this.vin()
  );

  readonly displayStatus = computed<StatusResult | null>(() => {
    const v = this.displayVehicle();
    return v ? computeStatus(v) : null;
  });

  ngOnInit() {
    const params = new URLSearchParams(window.location.search);
    this.vin.set(params.get(VIN_PARAM));
  }

  selectDemoVin(vin: string) {
    this.demoVin.set(vin);
  }

  formatPrice(cents: number, applyHuk = false): string {
    const amount = applyHuk ? Math.round(cents * (1 - HUK_DISCOUNT)) : cents;
    return (amount / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
  }

  formatKm(km: number): string {
    return km.toLocaleString('de-DE') + ' km';
  }

  statusLabel(s: ServiceStatus): string {
    if (s === 'ok') return 'Service aktuell';
    if (s === 'bald') return 'Bald fällig';
    return 'Überfällig';
  }

  statusIcon(s: ServiceStatus): string {
    if (s === 'ok') return '✓';
    if (s === 'bald') return '!';
    return '!!';
  }

  statusDetail(st: StatusResult): string {
    if (st.daysLeft < 0) {
      return `Seit ${Math.abs(st.daysLeft)} Tagen überfällig`;
    }
    if (st.status === 'ok') {
      return `Nächster Service in ca. ${st.kmLeft.toLocaleString('de-DE')} km`;
    }
    if (st.daysLeft === 0) return 'Heute fällig';
    return `In ${st.daysLeft} Tagen fällig`;
  }

  bookingUrl(serviceKey?: string): string {
    const v = this.displayVehicle();
    const vin = this.displayVin();
    const url = new URL(PITSTOP_BASE);
    if (vin) url.searchParams.set('vin', vin);
    if (v) url.searchParams.set('plate', v.plate);
    if (serviceKey) url.searchParams.set('service', serviceKey);
    url.searchParams.set('utm_source', 'pittap');
    return url.toString();
  }
}
