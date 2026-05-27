# Feature: Real-Time Inventory Alert & Reorder System

## Business Context

RetailCo operates 42 stores and one central e-commerce channel. Store managers and the operations team currently rely on end-of-day spreadsheets to spot low stock. By the time issues are noticed, popular SKUs are often out of stock for 24–48 hours, causing lost sales and customer complaints.

We need a **real-time inventory monitoring and alert system** that notifies the right people when stock crosses configurable thresholds and helps them trigger reorders before shelves go empty.

## Problem Statement

- Stock levels are updated in the ERP every 15–30 minutes, but alerts are manual.
- E-commerce and in-store inventory are not always aligned.
- There is no single view of “at-risk” SKUs across locations.
- Reorder decisions depend on individual manager experience rather than consistent rules.

## Target Users

| Persona | Goal |
|--------|------|
| Store Manager | See low-stock items for their location and act before stockouts |
| Regional Operations Lead | Monitor trends across a region and approve bulk reorders |
| Supply Chain Analyst | Configure thresholds, suppliers, and reorder rules |
| E-commerce Merchandiser | Ensure online listings reflect available quantity |

## Functional Requirements

### 1. Real-time inventory ingestion

- Consume inventory change events from the existing ERP (REST webhook or nightly batch fallback).
- Support SKU, location (store ID or warehouse), on-hand quantity, reserved quantity, and last-updated timestamp.
- Reflect updates in the dashboard within **2 minutes** of ERP change (target; confirm with IT).

### 2. Threshold & alert rules

- Allow rules per SKU category, location, or supplier:
  - Minimum on-hand quantity
  - Days-of-cover based on trailing 14-day sales velocity
  - Critical vs warning severity
- Send alerts via **email** and **in-app notifications** (SMS optional for critical only).
- Escalate to regional lead if no action within 4 business hours.

### 3. Operations dashboard

- Real-time list of at-risk SKUs with filters: location, category, severity, supplier.
- Trend sparkline for last 7 days of stock level per SKU/location.
- One-click actions: acknowledge alert, create draft purchase order, snooze for 24h (with reason).

### 4. Reorder workflow

- Generate draft PO with suggested quantity based on reorder point + economic order quantity (EOQ) formula.
- Route PO for approval to regional lead when order value exceeds $5,000.
- Export approved PO to ERP procurement module (API integration TBD).

### 5. E-commerce sync (phase 1 scope TBD)

- When store/warehouse stock for a SKU drops below safety stock, optionally reduce or flag the e-commerce listing.
- Prevent overselling when combined available quantity is below cart threshold.

## Non-Functional Requirements

- Dashboard must support **200 concurrent users** during peak morning checks.
- Alert delivery: 95% of critical alerts within 5 minutes of threshold breach.
- Audit log for every rule change, alert acknowledgment, and PO action (retain 7 years for compliance).
- Role-based access: store managers see only their locations; analysts see all.
- Availability target: 99.5% during business hours (6 AM – 10 PM local).

## Integrations

- **ERP**: Product master, inventory balances, PO creation (existing vendor: NetSuite — confirm API version).
- **Email**: SendGrid or corporate SMTP.
- **Identity**: SSO via Azure AD (same as internal HR portal).
- **Optional**: Slack channel for regional ops teams.

## Out of Scope (v1)

- Demand forecasting / ML-based replenishment
- Supplier portal for direct vendor submissions
- Mobile native app (responsive web only for v1)

## Success Metrics

- Reduce stockout incidents on top 500 SKUs by **30%** within 90 days of launch.
- Average time from threshold breach to manager acknowledgment under **30 minutes**.
- 80% of critical alerts result in a reorder or documented snooze reason within 24 hours.
- Zero unauthorized access incidents in penetration test before go-live.

## Open Questions for Product / Engineering

1. Is SMS required for v1 or can it be phase 2?
2. Which ERP events are available in real time vs batch only?
3. Should e-commerce listing updates be automatic or manual approval?
4. What is the source of truth when ERP and e-commerce quantities conflict?
5. Are there regulatory constraints on storing inventory data in a new SaaS tool vs on-prem only?

## Timeline Expectation

- MVP for 5 pilot stores: **Q3**
- Full rollout to all locations: **Q4**
- Executive demo requested for board meeting in **10 weeks**
