/**
 *  Spelling Bee Assistant is an add-on for Spelling Bee, the New York Times’ popular word puzzle
 *
 *  Copyright (C) 2020  Dieter Raber
 *  https://www.gnu.org/licenses/gpl-3.0.en.html
 */

// Tier thresholds in percent based on the actual game code
import data from "../modules/data.js";
import fn from "fancy-node";
import {prefix} from "./string.js";

import tableUtils from './table.utils.js';
import ProgressBuilder from "../widgets/progressBuilder.js";

const tiers = [
    ["Beginner", 0],
    ["Good Start", 2],
    ["Moving Up", 5],
    ["Good", 8],
    ["Solid", 15],
    ["Nice", 25],
    ["Great", 40],
    ["Amazing", 50],
    ["Genius", 70],
    ["Queen Bee", 100]
];

export const getSummaryTableData = (fieldName) => {
    const achievements = data.getFoundAndTotal(fieldName);
    return [
        ["✓", "?", "∑"],
        [achievements.found, achievements.total - achievements.found, achievements.total],
    ];
}

/**
 * Generate the rows for the milestone tier table.
 * @param {boolean} [reversed=true] - Whether to reverse the tier order.
 * @returns {Array[]} A 2D array of table rows.
 */
export const getMilestoneData = (reversed = true) => {
    const pointObj = data.getFoundAndTotal("points");
    const rows = [["", "To reach"]];
    const tierData = reversed ? tiers.toReversed() : tiers;
    tierData.forEach((entry) => {
        rows.push([entry[0], Math.round((entry[1] / 100) * pointObj.total)]);
    });
    return rows;
}

/**
 * Get the current tier the user has reached.
 * @param {{found: number, max: number}} pointObj
 * @returns {{name: string, value: number, additionalPoints: number}} The matching tier.
 */
export const getCurrentTier = (pointObj) => {
    const tier = getMilestoneData(false)
        .filter((entry) => !isNaN(entry[1]) && entry[1] <= pointObj.found)
        .pop();
    return {
        name: tier[0],
        value: tier[1],
        additionalPoints: pointObj.found - tier[1],
    };
}

/**
 * Get the next upcoming tier based on current score.
 * @param {{found: number, max: number}} pointObj
 * @returns {{name?: string, value?: number, missingPoints: number}} Next tier info or missingPoints = 0 if none.
 */
export const getNextTier = (pointObj) => {
    /*
     * pointObj.found is the number of points the user has found
     * nextTier[1] is the number of points required for the next tier
     * missingPoints is the difference between the next tier and the points the user has already achieved
     */
    const nextTier = getMilestoneData(false)
        .filter((entry) => !isNaN(entry[1]) && entry[1] > pointObj.found)
        .shift();

    return nextTier && nextTier.length
        ? {
            name: nextTier[0],
            value: nextTier[1],
            missingPoints: nextTier[1] - pointObj.found,
        }
        : {
            name: null,
            value: null,
            missingPoints: 0,
        };
}

/**
 * Build description stating the current tier and next tier, points and such
 * @returns {Array|String}
 */
export const getDescription = () => {
    const pointObj = data.getFoundAndTotal("points");
    const currentTier = getCurrentTier(pointObj);
    const nextTier = getNextTier(pointObj);

    return nextTier.name && pointObj.found < pointObj.total
        ? [
            `You’re at "`,
            fn.b({content: currentTier.name}),
            `" and just `,
            fn.b({content: nextTier.missingPoints}),
            ` ${nextTier.missingPoints !== 1 ? "points" : "point"} away from "`,
            fn.b({content: nextTier.name}),
            `".`,
        ]
        : `You’ve completed today’s puzzle. Here’s a recap.`;
}
//rowData, rowIdx, rowObj, skeleton
export const getMilestoneTableRowCallbacks = () => {
    return [
        (rowData, rowIdx, rowObj, skeleton) => {
            const pointObj = data.getFoundAndTotal("points");
            const currentTier = getCurrentTier(pointObj);
            const nextTier = getNextTier(pointObj);
            if(rowIdx > 0){
                rowObj.classNames.push(prefix(rowData[0], "d"));
            }
            if (rowData[1] < pointObj.found && rowData[1] !== currentTier.value) {
                rowObj.classNames.push(prefix("completed", "d"));
            }
            if (rowData[1] === currentTier.value) {
                rowObj.classNames.push(prefix("preeminent", "d"));
                if(rowIdx !== 1) { // = queen bee
                    getProgressbarInjectionCallback(
                        currentTier.additionalPoints,
                        nextTier.value - currentTier.value,
                        rowObj,
                        skeleton
                    );
                }
            }
        },

    ];
}

export const getSummaryTableRowCallbacks = () => {
    return [
        (rowData, rowIdx, rowObj, skeleton) => {
            if (rowIdx === 1) {
                getProgressbarInjectionCallback(
                    rowData[0],
                    rowData[2],
                    rowObj,
                    skeleton
                );
            }
        },

    ];
}

const getProgressbarInjectionCallback = (points, max, rowObj, skeleton) => {

    const tableRow = {
        tag: "tr",
        content: [
            {
                tag: "td",
                classNames: [prefix("progress-box", "d")],
                attributes: {colspan: rowObj.content.length},
                content: (new ProgressBuilder(points, max)).ui
            }
        ]
    };

    tableUtils.insertAfterCurrentRow(skeleton, rowObj, tableRow);
}