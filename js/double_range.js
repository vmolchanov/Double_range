"use strict";

(function () {

    /**
     * @param {Element} range
     * @constructor
     */
    function DoubleRange(range) {
        this._lineMiddle = range.querySelector(".double-range__line-middle");
        this._lineLeft = range.querySelector(".double-range__line-left");
        this._lineRight = range.querySelector(".double-range__line-right");
        this._minBtn = range.querySelector(".double-range__min-btn");
        this._maxBtn = range.querySelector(".double-range__max-btn");
        this._min = range.getAttribute("data-min");
        this._max = range.getAttribute("data-max");
        this._minOutput = document.querySelector("input[data-for=double-range-min]");
        this._maxOutput = document.querySelector("input[data-for=double-range-max]");

        var lineWidth = this._lineMiddle.getBoundingClientRect().width +
                        this._lineLeft.getBoundingClientRect().width +
                        this._lineRight.getBoundingClientRect().width;

        /** @type {number} цена деления */
        this._divVal = lineWidth / (this._max - this._min);

        var self = this;

            // установка значения по умолчанию при загрузке странице
        this._minOutput.value = this._min;
        this._maxOutput.value = this._max;

        // this._output.oninput = function() {
        //     if (self._inputValidate()) {
        //         self._setBtnPosition(self._minOutput.value);
        //     }
        // };

        // поведение кнопки минимального значения ползунка
        this._minBtn.onmousedown = function (event) {
            document.onmousemove = function(event) {
                var lineLeftCoordX = self._lineLeft.getBoundingClientRect().left;
                var coordX = event.pageX - lineLeftCoordX;
                var maxBtnCoordX = self._maxBtn.getBoundingClientRect().left - lineLeftCoordX;
                var minBtnWidth = self._minBtn.getBoundingClientRect().width;

                var middleLineWidth = maxBtnCoordX - coordX;
                var leftLineWidth = lineWidth - middleLineWidth - self._lineRight.getBoundingClientRect().width;

                if (coordX + minBtnWidth <= maxBtnCoordX) {
                    if (coordX > 0) {
                        self._lineMiddle.style.width = middleLineWidth + "px";
                        self._lineLeft.style.width = leftLineWidth + "px";
                    } else {
                        self._lineMiddle.style.width = lineWidth - self._lineRight.getBoundingClientRect().width + "px";
                        self._lineLeft.style.width = "0";

                        self._minBtn.style.left = -minBtnWidth / 2 + "px";
                    }

                    self._moveAt(self._minBtn, coordX, lineWidth);
                } else {
                    self._lineMiddle.style.width = "0";
                    self._lineLeft.style.width = lineWidth - self._lineRight.getBoundingClientRect().width + "px";

                    self._minBtn.style.left = maxBtnCoordX - minBtnWidth + "px";
                }

                self._setValue();
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        // поведение кнопки максимального значения ползунка
        this._maxBtn.onmousedown = function (event) {
            document.onmousemove = function(event) {
                var lineLeftCoordX = self._lineLeft.getBoundingClientRect().left;
                var coordX = event.pageX - lineLeftCoordX;
                var minBtnCoordX = self._minBtn.getBoundingClientRect().left - lineLeftCoordX;
                var maxBtnWidth = self._maxBtn.getBoundingClientRect().width;

                var middleLineWidth = coordX - maxBtnWidth / 2 - minBtnCoordX;
                var leftLineWidth = lineWidth - middleLineWidth - self._lineLeft.getBoundingClientRect().width;

                if (coordX - maxBtnWidth >= minBtnCoordX) {
                    if (coordX < lineWidth) {
                        self._lineMiddle.style.width = middleLineWidth + "px";
                        self._lineRight.style.width = leftLineWidth + "px";
                    } else {
                        self._lineMiddle.style.width = lineWidth - self._lineLeft.getBoundingClientRect().width + "px";
                        self._lineRight.style.width = "0";

                        self._maxBtn.style.left = lineWidth + maxBtnWidth / 2 + "px";
                    }

                    self._moveAt(self._maxBtn, coordX, lineWidth);
                } else {
                    self._lineMiddle.style.width = "0";
                    self._lineRight.style.width = lineWidth - self._lineLeft.getBoundingClientRect().width + "px";

                    self._maxBtn.style.left = minBtnCoordX + maxBtnWidth + "px";
                }

                self._setValue();
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }
    }

    /**
     * Перемещение ползунка на заданное расстояние
     * @param {number} shift
     * @param {number} lineWidth
     * @private
     */
    DoubleRange.prototype._moveAt = function(btn, shift, lineWidth) {
        /** @type {number} координата минимального значения */
        var beginPoint = -btn.getBoundingClientRect().width / 2;
        /** @type {number} координата максимального значения */
        var endPoint = lineWidth - btn.getBoundingClientRect().width / 2;

        if (shift < beginPoint) {
            btn.style.left = beginPoint;
        } else if (shift >= endPoint) {
            btn.style.left = endPoint + "px";
        } else {
            btn.style.left = shift + "px";
        }
    };


    /**
     * Вычисление значения относительно положения ползунка
     * @private
     */
    DoubleRange.prototype._setValue = function() {
        var minBtnCoordLeft = this._minBtn.getBoundingClientRect().left;
        var maxBtnCoordLeft = this._maxBtn.getBoundingClientRect().left;
        var minBtnWidth = this._minBtn.getBoundingClientRect().width;
        var maxBtnWidth = this._maxBtn.getBoundingClientRect().width;
        var lineLeft = this._lineLeft.getBoundingClientRect().left;
        var coordCenterMinBtn = minBtnCoordLeft - lineLeft + minBtnWidth / 2;
        var coordCenterMaxBtn = maxBtnCoordLeft - lineLeft + maxBtnWidth / 2;

        this._valueMin = +this._min + Math.floor(coordCenterMinBtn / this._divVal);
        this._valueMax = +this._min + Math.floor(coordCenterMaxBtn / this._divVal);

        this._minOutput.value = this._valueMin;
        this._maxOutput.value = this._valueMax;
    };

    window.DoubleRange = DoubleRange;

})();
