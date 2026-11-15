import {
  AllDaySplitter,
  BaseComponent,
  DateComponent,
  DateProfileGenerator,
  DayGridLayout,
  DaySeriesModel,
  DaySeriesSlicer,
  DayTableSlicer,
  DayTimeColsSlicer,
  NowTimer,
  TimeGridLayout,
  buildDateRowConfigs,
  buildDayColsFromSeries,
  buildDayTableModel,
  createDayHeaderFormatter,
  memoize,
  organizeSegsByCol,
  splitInteractionByCol
} from "./chunk-DKOMOQH6.js";
import {
  addDays,
  addWeeks,
  diffWeeks
} from "./chunk-RQ4HGFPN.js";
import {
  u
} from "./chunk-GOSSR2CB.js";
import "./chunk-RHF36VR4.js";
import "./chunk-GOMI4DH3.js";

// node_modules/fullcalendar/chunks/63421ff4.js
var TableDateProfileGenerator = class extends DateProfileGenerator {
  // Computes the date range that will be rendered
  buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay) {
    let renderRange = super.buildRenderRange(currentRange, currentRangeUnit, isRangeAllDay);
    let { props } = this;
    return buildDayTableRenderRange({
      currentRange: renderRange,
      // ???
      snapToWeek: /^(year|month)$/.test(currentRangeUnit),
      fixedWeekCount: props.fixedWeekCount,
      dateEnv: props.dateEnv
    });
  }
};
function buildDayTableRenderRange(props) {
  let { dateEnv, currentRange } = props;
  let { start, end } = currentRange;
  let endOfWeek;
  if (props.snapToWeek) {
    start = dateEnv.startOfWeek(start);
    endOfWeek = dateEnv.startOfWeek(end);
    if (endOfWeek.valueOf() !== end.valueOf()) {
      end = addWeeks(endOfWeek, 1);
    }
  }
  if (props.fixedWeekCount) {
    let lastMonthRenderStart = dateEnv.startOfWeek(dateEnv.startOfMonth(addDays(currentRange.end, -1)));
    let rowCount = Math.ceil(
      // could be partial weeks due to hiddenDays
      diffWeeks(lastMonthRenderStart, end)
    );
    end = addWeeks(end, 6 - rowCount);
  }
  return { start, end };
}

// node_modules/fullcalendar/chunks/7367f8ae.js
var DayGridView = class extends BaseComponent {
  constructor() {
    super(...arguments);
    this.buildDayTableModel = memoize(buildDayTableModel);
    this.buildDateRowConfigs = memoize(buildDateRowConfigs);
    this.createDayHeaderFormatter = memoize(createDayHeaderFormatter);
    this.slicer = new DayTableSlicer();
  }
  render() {
    const { props, context } = this;
    const { dateProfile } = props;
    const { options, dateEnv } = context;
    const dayTableModel = this.buildDayTableModel(dateProfile, context.dateProfileGenerator, dateEnv);
    const datesRepDistinctDays = dayTableModel.rowCount === 1;
    const dayHeaderFormat = this.createDayHeaderFormatter(context.options.dayHeaderFormat, datesRepDistinctDays, dayTableModel.colCount);
    const slicedProps = this.slicer.sliceProps(props, dateProfile, options.nextDayThreshold, context, dayTableModel);
    return u(NowTimer, { unit: "day", children: (nowDate, todayRange) => {
      const headerTiers = this.buildDateRowConfigs(dayTableModel.headerDates, datesRepDistinctDays, dateProfile, todayRange, dayHeaderFormat, context);
      return u(DayGridLayout, {
        labelId: props.labelId,
        labelStr: props.labelStr,
        dateProfile,
        todayRange,
        cellRows: dayTableModel.cellRows,
        forPrint: props.forPrint,
        className: props.className,
        // header content
        headerTiers,
        // body content
        fgEventSegs: slicedProps.fgEventSegs,
        bgEventSegs: slicedProps.bgEventSegs,
        businessHourSegs: slicedProps.businessHourSegs,
        dateSelectionSegs: slicedProps.dateSelectionSegs,
        eventDrag: slicedProps.eventDrag,
        eventResize: slicedProps.eventResize,
        eventSelection: slicedProps.eventSelection
      });
    } });
  }
};
var dayGridPlugin = {
  name: "daygrid",
  initialView: "dayGridMonth",
  views: {
    dayGrid: {
      component: DayGridView,
      dateProfileGeneratorClass: TableDateProfileGenerator
    },
    dayGridDay: {
      type: "dayGrid",
      duration: { days: 1 }
    },
    dayGridWeek: {
      type: "dayGrid",
      duration: { weeks: 1 }
    },
    dayGridMonth: {
      type: "dayGrid",
      duration: { months: 1 },
      fixedWeekCount: true
    },
    dayGridYear: {
      type: "dayGrid",
      duration: { years: 1 }
    }
  }
};

// node_modules/fullcalendar/chunks/84e8fba4.js
var TimeGridView = class extends DateComponent {
  constructor() {
    super(...arguments);
    this.createDayHeaderFormatter = memoize(createDayHeaderFormatter);
    this.buildDaySeries = memoize((dateProfile, dateProfileGenerator) => new DaySeriesModel(dateProfile.renderRange, dateProfileGenerator));
    this.buildDayCols = memoize(buildDayColsFromSeries);
    this.extractColDates = memoize((cols) => cols.map((col) => col.date));
    this.extractColRanges = memoize((cols) => cols.map((col) => col.range));
    this.buildDateRowConfigs = memoize(buildDateRowConfigs);
    this.splitFgEventSegs = memoize(organizeSegsByCol);
    this.splitBgEventSegs = memoize(organizeSegsByCol);
    this.splitBusinessHourSegs = memoize(organizeSegsByCol);
    this.splitNowIndicatorSegs = memoize(organizeSegsByCol);
    this.splitDateSelectionSegs = memoize(organizeSegsByCol);
    this.splitEventDrag = memoize(splitInteractionByCol);
    this.splitEventResize = memoize(splitInteractionByCol);
    this.allDaySplitter = new AllDaySplitter();
    this.daySeriesSlicer = new DaySeriesSlicer();
    this.dayTimeColsSlicer = new DayTimeColsSlicer();
  }
  render() {
    const { props, context } = this;
    const { dateProfile } = props;
    const { options, dateProfileGenerator } = context;
    const daySeries = this.buildDaySeries(dateProfile, dateProfileGenerator);
    const cols = this.buildDayCols(daySeries, context.dateEnv, {
      slotRange: dateProfile,
      activeRange: dateProfile.activeRange
    });
    const colDates = this.extractColDates(cols);
    const dayRanges = this.extractColRanges(cols);
    const splitProps = this.allDaySplitter.splitProps(props);
    const allDayProps = this.daySeriesSlicer.sliceProps(splitProps.allDay, dateProfile, options.nextDayThreshold, context, daySeries);
    const timedProps = this.dayTimeColsSlicer.sliceProps(splitProps.timed, dateProfile, null, context, dayRanges);
    const dayHeaderFormat = this.createDayHeaderFormatter(
      context.options.dayHeaderFormat,
      true,
      // datesRepDistinctDays
      cols.length
    );
    return u(NowTimer, { unit: options.nowIndicator ? "minute" : "day", children: (nowDate, todayRange, nowMs) => {
      const colCount = cols.length;
      const nowIndicatorSeg = !props.forPrint && options.nowIndicator && this.dayTimeColsSlicer.sliceNowDate(nowDate, dateProfile, options.nextDayThreshold, context, dayRanges);
      const fgEventSegsByCol = this.splitFgEventSegs(timedProps.fgEventSegs, colCount);
      const bgEventSegsByCol = this.splitBgEventSegs(timedProps.bgEventSegs, colCount);
      const businessHourSegsByCol = this.splitBusinessHourSegs(timedProps.businessHourSegs, colCount);
      const nowIndicatorSegsByCol = this.splitNowIndicatorSegs(nowIndicatorSeg, colCount);
      const dateSelectionSegsByCol = this.splitDateSelectionSegs(timedProps.dateSelectionSegs, colCount);
      const eventDragByCol = this.splitEventDrag(timedProps.eventDrag, colCount);
      const eventResizeByCol = this.splitEventResize(timedProps.eventResize, colCount);
      const headerTiers = this.buildDateRowConfigs(
        colDates,
        true,
        // datesRepDistinctDays
        props.dateProfile,
        todayRange,
        dayHeaderFormat,
        context
      );
      return u(TimeGridLayout, {
        labelId: props.labelId,
        labelStr: props.labelStr,
        dateProfile,
        nowDate,
        nowMs,
        todayRange,
        cells: cols,
        forPrint: props.forPrint,
        className: props.className,
        // header content
        headerTiers,
        // all-day content
        fgEventSegs: allDayProps.fgEventSegs,
        bgEventSegs: allDayProps.bgEventSegs,
        businessHourSegs: allDayProps.businessHourSegs,
        dateSelectionSegs: allDayProps.dateSelectionSegs,
        eventDrag: allDayProps.eventDrag,
        eventResize: allDayProps.eventResize,
        // timed content
        fgEventSegsByCol,
        bgEventSegsByCol,
        businessHourSegsByCol,
        nowIndicatorSegsByCol,
        dateSelectionSegsByCol,
        eventDragByCol,
        eventResizeByCol,
        // universal content
        eventSelection: props.eventSelection
      });
    } });
  }
};
var timeGridPlugin = {
  name: "timegrid",
  initialView: "timeGridWeek",
  deps: [dayGridPlugin],
  views: {
    timeGrid: {
      component: TimeGridView,
      usesMinMaxTime: true,
      // indicates that slotMinTime/slotMaxTime affects rendering
      allDaySlot: true,
      slotDuration: "00:30:00",
      slotEventOverlap: true
      // a bad name. confused with overlap/constraint system
    },
    timeGridDay: {
      type: "timeGrid",
      duration: { days: 1 }
    },
    timeGridWeek: {
      type: "timeGrid",
      duration: { weeks: 1 }
    }
  }
};
export {
  timeGridPlugin as default
};
//# sourceMappingURL=@fullcalendar_angular_timegrid.js.map
