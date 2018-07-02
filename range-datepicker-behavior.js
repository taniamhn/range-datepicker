
/**
 * `range-datepicker-behavior`
 *
 */

/* eslint no-unused-vars: off */

/* @polymerMixin */
export const RangeDatepickerBehavior = subclass =>
  class extends subclass {
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
          this._monthPlus = '0' + monthPlus;
        }
        else {
          this._monthPlus = '' + monthPlus;
        }
      }
    }

    _isNarrow(forceNarrow, narrow) {
      if (forceNarrow || narrow) {
        return true;
      }
      return false;
    }

    _noRangeChanged(isNoRange, wasNoRange) {
      if (!wasNoRange && isNoRange) {
        this.dateTo = undefined;
        this._hoveredDate = undefined;
      }
    }
  };
