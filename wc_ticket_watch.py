#!/usr/bin/env python3
"""wc_ticket_watch.py — World Cup Final ticket price monitor.

Polls SeatGeek and Ticketmaster for ticket prices for the 2026 FIFA World Cup
Final (Spain vs Argentina, July 19 2026, MetLife Stadium), tracks the session
low, and fires a macOS notification (plus terminal bell) when the SeatGeek
get-in price drops below the alert threshold.

Usage:
    python3 wc_ticket_watch.py           # poll forever
    python3 wc_ticket_watch.py --once    # single poll cycle (for testing)
"""

import shutil
import subprocess
import sys
import time
from datetime import datetime

import requests

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
SEATGEEK_CLIENT_ID = "NTk3MzgwNzR8MTc4NDQ4MDc0OC4xNTk4NDQy"
TICKETMASTER_API_KEY = ""  # paste your Ticketmaster Discovery API key here

PRICE_ALERT_THRESHOLD = 8_000.0  # USD — alert when SeatGeek get-in drops below
POLL_INTERVAL_SECONDS = 120      # 2 minutes

EVENT_DATE = "2026-07-19"
VENUE_KEYWORD = "metlife"        # case-insensitive venue match

SEATGEEK_EVENTS_URL = "https://api.seatgeek.com/2/events"
TICKETMASTER_EVENTS_URL = "https://app.ticketmaster.com/discovery/v2/events.json"
REQUEST_TIMEOUT = 15


def ts() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def log(source: str, message: str) -> None:
    print(f"[{ts()}] [{source:12s}] {message}", flush=True)


# ---------------------------------------------------------------------------
# SeatGeek
# ---------------------------------------------------------------------------
def poll_seatgeek():
    """Return (lowest_price, listing_count) for the Final, or None on failure."""
    params = {
        "client_id": SEATGEEK_CLIENT_ID,
        "q": "world cup final",
        "datetime_local.gte": EVENT_DATE,
        "datetime_local.lte": f"{EVENT_DATE}T23:59:59",
        "per_page": 25,
    }
    resp = requests.get(SEATGEEK_EVENTS_URL, params=params, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    events = resp.json().get("events", [])

    for event in events:
        venue_name = (event.get("venue") or {}).get("name", "")
        if VENUE_KEYWORD in venue_name.lower():
            stats = event.get("stats") or {}
            return stats.get("lowest_price"), stats.get("listing_count")

    log("seatgeek", f"no event matched venue '{VENUE_KEYWORD}' among {len(events)} result(s)")
    return None


# ---------------------------------------------------------------------------
# Ticketmaster Discovery
# ---------------------------------------------------------------------------
def poll_ticketmaster():
    """Return (price_min, price_max) for the Final, or None on failure/no data.

    Discovery API price data can be stale for resale events — treat these
    numbers as approximate context, not a live get-in price.
    """
    if not TICKETMASTER_API_KEY:
        log("ticketmaster", "skipped — TICKETMASTER_API_KEY not set")
        return None

    params = {
        "apikey": TICKETMASTER_API_KEY,
        "keyword": "FIFA World Cup Final",
        "startDateTime": f"{EVENT_DATE}T00:00:00Z",
        "endDateTime": f"{EVENT_DATE}T23:59:59Z",
        "size": 25,
    }
    resp = requests.get(TICKETMASTER_EVENTS_URL, params=params, timeout=REQUEST_TIMEOUT)
    resp.raise_for_status()
    events = (resp.json().get("_embedded") or {}).get("events", [])

    for event in events:
        venues = ((event.get("_embedded") or {}).get("venues")) or []
        venue_names = " ".join(v.get("name", "") for v in venues).lower()
        if VENUE_KEYWORD not in venue_names:
            continue
        for pr in event.get("priceRanges") or []:
            return pr.get("min"), pr.get("max")
        log("ticketmaster", "event found but no priceRanges in response")
        return None

    log("ticketmaster", f"no event matched venue '{VENUE_KEYWORD}' among {len(events)} result(s)")
    return None


# ---------------------------------------------------------------------------
# Alerting
# ---------------------------------------------------------------------------
def fire_alert(price: float) -> None:
    message = f"World Cup Final get-in dropped to ${price:,.0f} (below ${PRICE_ALERT_THRESHOLD:,.0f})"
    print("\a", end="", flush=True)  # terminal bell
    log("ALERT", message)

    if shutil.which("osascript"):
        script = (
            f'display notification "{message}" '
            f'with title "WC Final Ticket Alert" sound name "Sosumi"'
        )
        try:
            subprocess.run(["osascript", "-e", script], timeout=10, check=False)
        except Exception as exc:  # notification failure must not kill the loop
            log("ALERT", f"osascript failed: {exc}")
    else:
        log("ALERT", "osascript not available on this system — bell only")


# ---------------------------------------------------------------------------
# Main loop
# ---------------------------------------------------------------------------
def run_cycle(state: dict) -> None:
    # SeatGeek — the primary, live resale source
    try:
        result = poll_seatgeek()
        if result and result[0] is not None:
            price, listings = result
            log("seatgeek", f"get-in ${price:,.2f} | {listings or '?'} listings")

            if state["session_low"] is None or price < state["session_low"]:
                state["session_low"] = price
                log("seatgeek", f"*** new session low: ${price:,.2f} ***")

            if price < PRICE_ALERT_THRESHOLD and not state["alerted"]:
                fire_alert(price)
                state["alerted"] = True
            elif price >= PRICE_ALERT_THRESHOLD:
                state["alerted"] = False  # re-arm if price climbs back up
        elif result:
            log("seatgeek", "event found but stats.lowest_price is null")
    except requests.RequestException as exc:
        log("seatgeek", f"request failed: {exc}")
    except Exception as exc:
        log("seatgeek", f"unexpected error: {exc}")

    # Ticketmaster — approximate context only
    try:
        result = poll_ticketmaster()
        if result:
            pmin, pmax = result
            log("ticketmaster", f"priceRanges ${pmin:,.2f}–${pmax:,.2f} (approximate/possibly stale)")
    except requests.RequestException as exc:
        log("ticketmaster", f"request failed: {exc}")
    except Exception as exc:
        log("ticketmaster", f"unexpected error: {exc}")

    if state["session_low"] is not None:
        log("session", f"low so far: ${state['session_low']:,.2f} | threshold ${PRICE_ALERT_THRESHOLD:,.0f}")


def main() -> None:
    once = "--once" in sys.argv
    log("monitor", f"watching WC Final {EVENT_DATE} @ MetLife | "
                   f"alert below ${PRICE_ALERT_THRESHOLD:,.0f} | every {POLL_INTERVAL_SECONDS}s")

    state = {"session_low": None, "alerted": False}
    while True:
        run_cycle(state)
        if once:
            break
        time.sleep(POLL_INTERVAL_SECONDS)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nstopped.")
