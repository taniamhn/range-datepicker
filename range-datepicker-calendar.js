import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/paper-styles/typography.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import moment from 'moment';
import './range-datepicker-cell.js';
/**
 * `range-datepicker-calendar`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RangeDatepickerCalendar extends PolymerElement {
  static get template() {
    return html`
    <style include="iron-flex iron-flex-alignment">
      :host {
        @apply --paper-font-common-base;
        display: block;
        width: 266px;
      }

      :host>div {
        overflow: hidden;
      }

      div.table {
        display: table;
        border-collapse: collapse;
        table-layout: fixed;
      }

      div.th {
        display: table-cell;
        @apply --paper-font-caption;
        color: var(--range-datepicker-day-names-text, rgb(117, 117, 117));
        font-size: 11px;
        width: 38px;
        padding: 0;
        margin: 0;
        text-align: center;
      }

      div.tr {
        display: table-row;
        height: 38px;
      }

      div.td {
        display: table-cell;
        padding: 0;
        width: 38px;
        margin: 0;
        height: 38px;
      }

      .monthName {
        @apply --paper-font-title;
        width: 266px;
        margin: 10px 0;
        text-align: center;
        color: var(--range-datepicker-month-text);
      }

      .monthName::first-letter {
        text-transform: uppercase;
      }

      .monthName>div>div {
        margin-right: 8px;
        height: 30px;
      }

      paper-listbox {
        max-height: 200px;
      }

      div.tbody {
        transition: all 0ms;
        transform: translateX(0);
        height: 235px;
      }

      .withTransition {
        transition: all 100ms;
      }

      .moveToLeft {
        transform: translateX(-274px);
      }

      .moveToRight {
        transform: translateX(274px);
      }

      .withTransition td,
      .moveToLeft td,
      .moveToRight td {
        border: none;
      }

      paper-dropdown-menu {
        --paper-input-container-underline: {
          display: none;
        }

        --paper-input-container-underline-focus: {
          display: none;
        }
        --paper-input-container-underline-disabled: {
          display: none;
        }

        --paper-input-container: {
          width: 75px;
          padding: 0;
        }

        --paper-input-container-input: {
          @apply --paper-font-title;
        }
      }
    </style>

    <div>
      <div class="monthName layout horizontal center">
        <dom-if if="[[_ifNarrow(prev, narrow)]]">
          <template>
            <paper-icon-button icon="chevron-left" on-tap="_handlePrevMonth"></paper-icon-button>
          </template>
        </dom-if>
        <div class="flex layout horizontal center center-justified">
          <div>
            [[_computeCurrentMonthName(month, year)]]
          </div>
          <dom-if if="[[enableYearChange]]">
            <template>
              <paper-dropdown-menu no-label-float="">
                <paper-listbox slot="dropdown-content" selected="{{year}}" attr-for-selected="data-name">
                  <dom-repeat items="[[_yearsList]]" as="yearList">
                    <template>
                      <paper-item data-name\$="[[yearList]]">[[yearList]]</paper-item>
                    </template>
                  </dom-repeat>
                </paper-listbox>
              </paper-dropdown-menu>
            </template>
          </dom-if>
          <dom-if if="[[!enableYearChange]]">
            <template>
              [[year]]
            </template>
          </dom-if>
        </div>
        <dom-if if="[[_ifNarrow(next, narrow)]]">
          <template>
            <paper-icon-button icon="chevron-right" on-tap="_handleNextMonth"></paper-icon-button>
          </template>
        </dom-if>
      </div>

      <div class="table">
        <div class="thead">
          <div class="tr">
            <template is="dom-repeat" items="[[_dayNamesOfTheWeek]]" as="dayNameOfWeek">
              <div class="th">[[dayNameOfWeek]]
            </div></template>
          </div>
        </div>
        <div class="tbody">
          <template is="dom-repeat" items="[[_daysOfMonth]]" as="week">
            <div class="tr">
              <template is="dom-repeat" items="[[week]]" as="dayOfMonth">
                <div class\$="td [[_tdIsEnabled(dayOfMonth)]]">
                  <template is="dom-if" if="[[dayOfMonth]]">
                    <range-datepicker-cell disabled-days="[[disabledDays]]" min="[[min]]" max="[[max]]" month="[[month]]" on-date-is-hovered="_handleDateHovered" hovered-date="[[hoveredDate]]" date-to="[[dateTo]]" date-from="[[dateFrom]]" on-date-is-selected="_handleDateSelected" day="[[dayOfMonth]]"></range-datepicker-cell>
                  </template>
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
`;
  }

  static get is() {
    return 'range-datepicker-calendar';
  }
  static get properties() {
    return {
      month: String,
      year: {
        type: String,
        notify: true,
      },
      _dayNamesOfTheWeek: {
        type: Array,
        value: [],
      },
      _daysOfMonth: Array,
      locale: {
        type: String,
        value: 'en',
        observer: '_localeChanged',
      },
      dateTo: {
        type: Number,
        notify: true,
      },
      prev: Boolean,
      next: Boolean,
      dateFrom: {
        type: Number,
        notify: true,
      },
      hoveredDate: {
        type: Number,
        notify: true,
      },
      noRange: {
        type: Boolean,
        value: false,
      },
      narrow: {
        type: Boolean,
        value: false,
      },
      _yearsList: {
        type: Array,
        value: [],
      },
      enableYearChange: {
        type: Boolean,
        value: false,
        observer: '_enableYearChangeChanged',
      },
      min: Number,
      max: Number,
      disabledDays: Array,
    };
  }

  _localeChanged() {
    if (moment.localeData(this.locale)) {
      const dayNamesOfTheWeek = moment.localeData(this.locale).weekdaysMin();
      const firstDayOfWeek = moment.localeData(this.locale).firstDayOfWeek();
      const tmp = dayNamesOfTheWeek.slice().splice(0, firstDayOfWeek);
      const newDayNamesOfTheWeek = dayNamesOfTheWeek
        .slice()
        .splice(firstDayOfWeek, dayNamesOfTheWeek.length)
        .concat(tmp);
      this.set('_dayNamesOfTheWeek', newDayNamesOfTheWeek);
    }
  }

  static get observers() {
    return ['_yearAndMonthChanged(year, month)'];
  }

  _yearAndMonthChanged(year, month) {
    if (year && month) {
      const startDate = moment([year, month - 1]).locale(this.locale);
      const endDate = moment(startDate)
        .locale(this.locale)
        .endOf('month');

      const rows = [];
      let columns = [];

      const lastDayOfWeek = 6;

      while (startDate.format('DD/MM/YYYY') !== endDate.format('DD/MM/YYYY')) {
        const dayNumber = startDate.weekday();

        columns.push({
          hover: false,
          date: parseInt(startDate.format('X'), 10),
          title: parseInt(startDate.format('D'), 10),
        });

        if (dayNumber === lastDayOfWeek) {
          for (let i = columns.length; i < lastDayOfWeek + 1; i += 1) {
            columns.unshift(0);
          }
          rows.push(columns.slice());
          columns = [];
        }

        startDate.add(1, 'day');

        if (startDate.format('DD/MM/YYYY') === endDate.format('DD/MM/YYYY')) {
          columns.push({
            hover: false,
            date: parseInt(startDate.format('X'), 10),
            title: parseInt(startDate.format('D'), 10),
          });
          for (let i = columns.length; i <= lastDayOfWeek; i += 1) {
            columns.push(0);
          }
          rows.push(columns.slice());
          columns = [];
        }
      }
      this.set('_daysOfMonth', rows);
    }
  }

  _computeCurrentMonthName(month, year) {
    return moment(`${month}/${year}`, 'MM/YYYY')
      .locale(this.locale)
      .format('MMMM');
  }

  _tdIsEnabled(day) {
    if (day) {
      return 'enabled';
    }
    return '';
  }

  _handleDateSelected({ detail }) {
    const { date } = detail;
    if (!this.noRange) {
      if (this.dateFrom && this.dateTo) {
        this.dateFrom = date;
        this.dateTo = null;
        this.hoveredDate = undefined;
      } else if (!this.dateFrom || (this.dateFrom && date < this.dateFrom)) {
        this.dateFrom = date;
      } else if (!this.dateTo || (this.dateTo && date > this.dateTo)) {
        this.dateTo = date;
      }
    } else {
      this.dateFrom = date;
    }
  }

  _handleDateHovered(event) {
    if (!this.noRange) {
      this.hoveredDate = event.detail.date;
    }
  }

  _handleNextMonth() {
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToLeft');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToLeft');

    this.month = moment(this.month, 'MM')
      .locale(this.locale)
      .add(1, 'month')
      .format('MM');
    if (this.month === '01') {
      this.year = moment(this.year, 'YYYY')
        .locale(this.locale)
        .add(1, 'year')
        .format('YYYY');
    }
    this.dispatchEvent(new CustomEvent('next-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToRight');
      tbody.classList.remove('moveToLeft');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToRight');
      monthName.classList.remove('moveToLeft');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToRight');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToRight');
        setTimeout(() => {
          tbody.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  _handlePrevMonth() {
    const tbody = this.shadowRoot.querySelector('.tbody');
    const monthName = this.shadowRoot.querySelector('.monthName > div');
    tbody.classList.add('withTransition');
    tbody.classList.add('moveToRight');
    monthName.classList.add('withTransition');
    monthName.classList.add('moveToRight');

    this.month = moment(this.month, 'MM')
      .locale(this.locale)
      .subtract(1, 'month')
      .format('MM');
    if (this.month === '12') {
      this.year = moment(this.year, 'YYYY')
        .locale(this.locale)
        .subtract(1, 'year')
        .format('YYYY');
    }
    this.dispatchEvent(new CustomEvent('prev-month'));

    setTimeout(() => {
      tbody.classList.remove('withTransition');
      tbody.classList.add('moveToLeft');
      tbody.classList.remove('moveToRight');
      monthName.classList.remove('withTransition');
      monthName.classList.add('moveToLeft');
      monthName.classList.remove('moveToRight');

      setTimeout(() => {
        tbody.classList.add('withTransition');
        tbody.classList.remove('moveToLeft');
        monthName.classList.add('withTransition');
        monthName.classList.remove('moveToLeft');
        setTimeout(() => {
          monthName.classList.remove('withTransition');
          monthName.classList.remove('withTransition');
        }, 100);
      }, 100);
    }, 100);
  }

  _ifNarrow(pos, narrow) {
    if (pos || narrow) {
      return true;
    }
    return false;
  }

  ready() {
    super.ready();
    const yearsList = [];
    for (let i = 1970; i <= 2100; i += 1) {
      yearsList.push(i);
    }
    this.set('_yearsList', yearsList);
  }

  _enableYearChangeChanged(enableYearChange) {
    this.narrow = enableYearChange;
  }
}

window.customElements.define(RangeDatepickerCalendar.is, RangeDatepickerCalendar);
