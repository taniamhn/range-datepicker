import { format } from 'date-fns/esm';
import * as dateLocale from 'date-fns/esm/locale';

/**
 * `range-datepicker-behavior`
 *
 */

/* eslint no-unused-vars: off */

/* @polymerMixin */
const RangeDatepickerBehavior = subclass =>
  class extends subclass {
    _localeChanged(locale) {
      if (!this.month) {
        this.month = format(new Date(), 'MM', { locale: dateLocale[locale] });
      }
      if (!this.year) {
        this.year = format(new Date(), 'yyyy', { locale: dateLocale[locale] });
      }
    }

    _handlePrevMonth() {
      if (!this.enableYearChange) {
        this.shadowRoot.querySelector('range-datepicker-calendar[next]')._handlePrevMonth();
      }
    }

    _handleNextMonth() {
      if (!this.enableYearChange) {
        this.shadowRoot.querySelector('range-datepicker-calendar[prev]')._handleNextMonth();
      }
    }

    _monthChanged(month, year) {
      if (year && month) {
        let monthPlus = parseInt(month, 10) + 1;
        if (monthPlus > 12) {
          monthPlus = 1;
          this._yearPlus = parseInt(year, 10) + 1;
        } else {
          this._yearPlus = parseInt(year, 10);
        }
        if (monthPlus < 10) {
          this._monthPlus = `0${monthPlus}`;
        } else {
          this._monthPlus = `${monthPlus}`;
        }
      }
    }

    _isNarrow(forceNarrow, narrow) {
      return forceNarrow || narrow;
    }

    _noRangeChanged(isNoRange, wasNoRange) {
      if (!wasNoRange && isNoRange) {
        this.dateTo = undefined;
        this._hoveredDate = undefined;
      }
    }
  };

export default RangeDatepickerBehavior;
