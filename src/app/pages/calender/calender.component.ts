import { KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { PrimeNgModule } from 'src/app/core/modules/primeng/primeng.module';

import { Component, ViewChild } from '@angular/core';
import { EventInput, CalendarOptions, DateSelectArg, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { MaterialModule } from '../../core/modules/material/material.module';

interface CalendarEvent extends EventInput {
  start?: Date | string;
  end?: Date | string;
  extendedProps: {
    calendar: string;
  };
}

@Component({
  selector: 'app-calender',
  imports: [PrimeNgModule, FormsModule,
    KeyValuePipe,
    FullCalendarModule,
    ModalComponent,
    MaterialModule
  ],
  templateUrl: './calender.component.html',
  styles: ``
})
export class CalenderComponent {

  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  events: CalendarEvent[] = [];
  selectedEvent: CalendarEvent | null = null;
  eventTitle = '';
  eventStartDate: Date | null = null;
  eventEndDate: Date | null = null;
  eventLevel = '';
  isOpen = false;

  calendarsEvents: Record<string, string> = {
    Danger: 'danger',
    Success: 'success',
    Primary: 'primary',
    Warning: 'warning'
  };

  calendarOptions!: CalendarOptions;

  ngOnInit() {
    this.events = [
      {
        id: '1',
        title: 'Event Conf.',
        start: new Date().toISOString().split('T')[0],
        extendedProps: { calendar: 'Danger' }
      },
      {
        id: '2',
        title: 'Meeting',
        start: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        extendedProps: { calendar: 'Success' }
      },
      {
        id: '3',
        title: 'Workshop',
        start: new Date(Date.now() + 172800000).toISOString().split('T')[0],
        end: new Date(Date.now() + 259200000).toISOString().split('T')[0],
        extendedProps: { calendar: 'Primary' }
      }
    ];

    this.calendarOptions = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev,next addEventButton',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      selectable: true,
      events: this.events,
      select: (info) => this.handleDateSelect(info),
      eventClick: (info) => this.handleEventClick(info),
      customButtons: {
        addEventButton: {
          text: 'Add Event +',
          click: () => this.openModal()
        }
      },
      eventContent: (arg) => this.renderEventContent(arg)
    };
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.resetModalFields();
    this.eventStartDate = new Date(selectInfo.startStr);
    this.eventEndDate = selectInfo.endStr ? new Date(selectInfo.endStr) : new Date(selectInfo.startStr);
    this.openModal();
  }

  handleEventClick(clickInfo: EventClickArg) {
    const event = clickInfo.event as any;
    this.selectedEvent = {
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
      extendedProps: { calendar: event.extendedProps.calendar }
    };
    this.eventTitle = event.title;
    this.eventStartDate = event.start ?? new Date(event.startStr);
    this.eventEndDate = event.end ? event.end : (event.endStr ? new Date(event.endStr) : null);
    this.eventLevel = event.extendedProps.calendar;
    this.openModal();
  }

  handleAddOrUpdateEvent() {
    const start = this.eventStartDate ?? undefined;
    const end = this.eventEndDate ?? undefined;
    if (this.selectedEvent) {
      this.events = this.events.map(ev =>
        ev.id === this.selectedEvent!.id
          ? {
              ...ev,
              title: this.eventTitle,
              start,
              end,
              extendedProps: { calendar: this.eventLevel }
            }
          : ev
      );
    } else {
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: this.eventTitle,
        start,
        end,
        allDay: true,
        extendedProps: { calendar: this.eventLevel }
      };
      this.events = [...this.events, newEvent];
    }
    this.calendarOptions.events = this.events;
    this.closeModal();
    this.resetModalFields();
  }

  resetModalFields() {
    this.eventTitle = '';
    this.eventStartDate = null;
    this.eventEndDate = null;
    this.eventLevel = '';
    this.selectedEvent = null;
  }

  openModal() {
    this.isOpen = true;
  }

  closeModal() {
    this.isOpen = false;
    this.resetModalFields();
  }

  renderEventContent(eventInfo: any) {
    const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase()}`;
    return {
      html: `
        <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
          <div class="fc-daygrid-event-dot"></div>
          <div class="fc-event-time">${eventInfo.timeText || ''}</div>
          <div class="fc-event-title">${eventInfo.event.title}</div>
        </div>
      `
    };
  }
}
