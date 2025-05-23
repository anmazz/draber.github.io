/**
 *  Spelling Bee Assistant is an add-on for Spelling Bee, the New York Times’ popular word puzzle
 *
 *  Copyright (C) 2020  Dieter Raber
 *  https://www.gnu.org/licenses/gpl-3.0.en.html
 */
import Plugin from "../modules/plugin.js";
import tableUtils from "../utils/table.utils.js";
import {buildStandardTable} from '../widgets/tableBuilder.js'
import {prefix} from "../utils/string.js";
import DetailsBuilder from "../widgets/detailsBuilder.js";
import data from "../modules/data.js";

export default class StartSequence extends Plugin {
    togglePane() {
        return this.detailsBuilder.togglePane();
    }

    run(evt) {
        this.detailsBuilder.update(this.createTable());
        return this;
    }

    constructor(app, title, description, {letterCnt, shortcuts} = {}) {
        super(app, title, description, {runEvt: prefix("refreshUi")});

        this.detailsBuilder = new DetailsBuilder(this.title, false);
        this.ui = this.detailsBuilder.ui;

        this.shortcuts = shortcuts;
        this.letterCnt = letterCnt;
    }

    getData() {
        return tableUtils.buildFirstLetterTableData(this.letterCnt);
    }

    createTable() {
        return buildStandardTable(this.getData(),[
            (rowData, rowIdx, rowObj) => {
                if (rowData[2] === 0) {
                    rowObj.classNames.push(prefix("completed", "d"));
                }
                if (rowData[0] === data.getCenterLetter()) {
                    rowObj.classNames.push(prefix("preeminent", "d"));
                }
            },
        ]);
    }
}
