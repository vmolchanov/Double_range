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

        // изменение позиции кнопки минимального значения при изменении значения
        // в _minOutput
        this._minOutput.oninput = function() {
            if (self._inputValidate()) {
                self._setBtnPosition(self._minBtn, self._minOutput.value);

                var minBtnLeft = self._minBtn.getBoundingClientRect().left;
                var maxBtnLeft = self._maxBtn.getBoundingClientRect().left;
                var minBtnWidth = self._minBtn.getBoundingClientRect().width;
                var leftLineCoord = self._lineLeft.getBoundingClientRect().left;

                var middleLineWidth = maxBtnLeft - minBtnLeft;
                var leftLineWidth = minBtnLeft - leftLineCoord + minBtnWidth / 2;

                if (middleLineWidth < 0) {
                    // переопределяем ширину относительно книпки максимального значения
                    leftLineWidth = maxBtnLeft - leftLineCoord;

                    self._lineLeft.style.width = leftLineWidth + "px";
                    self._lineMiddle.style.width = Math.abs(middleLineWidth) + "px";
                    self._lineRight.style.width = lineWidth - Math.abs(middleLineWidth) - leftLineWidth - minBtnWidth / 2 + "px";
                } else {
                    self._lineMiddle.style.width = middleLineWidth + "px";
                    self._lineLeft.style.width = leftLineWidth + "px";
                    self._lineRight.style.width = lineWidth - leftLineWidth - middleLineWidth + "px";
                }
            }
        };

        // изменение позиции кнопки максимального значения при изменении значения
        // в _maxOutput
        this._maxOutput.oninput = function() {
            if (self._inputValidate()) {
                self._setBtnPosition(self._maxBtn, self._maxOutput.value);

                var minBtnLeft = self._minBtn.getBoundingClientRect().left;
                var maxBtnLeft = self._maxBtn.getBoundingClientRect().left;
                var maxBtnWidth = self._maxBtn.getBoundingClientRect().width;
                var leftLineCoord = self._lineLeft.getBoundingClientRect().left;

                var middleLineWidth = maxBtnLeft - minBtnLeft;
                var rightLineWidth = lineWidth - (maxBtnLeft - leftLineCoord) - maxBtnWidth / 2;

                if (middleLineWidth < 0) {
                    // переопределяем ширину относительно книпки минимального значения
                    rightLineWidth = lineWidth - (minBtnLeft - leftLineCoord) - maxBtnWidth / 2;

                    self._lineLeft.style.width = maxBtnLeft - leftLineCoord + maxBtnWidth / 2 + "px";
                    self._lineMiddle.style.width = Math.abs(middleLineWidth) + "px";
                    self._lineRight.style.width = rightLineWidth + "px";
                } else {
                    self._lineMiddle.style.width = middleLineWidth + "px";
                    self._lineRight.style.width = rightLineWidth + "px";
                    self._lineLeft.style.width = lineWidth - rightLineWidth - middleLineWidth + "px";
                }
            }
        };

        // поведение кнопки минимального значения ползунка
        this._minBtn.onmousedown = function (event) {
            document.onmousemove = function(event) {
                var lineLeftCoordX = self._lineLeft.getBoundingClientRect().left;
                var coordX = event.pageX - lineLeftCoordX;
                var maxBtnCoordX = self._maxBtn.getBoundingClientRect().left - lineLeftCoordX;

                var minBtnLeft = self._minBtn.getBoundingClientRect().left;
                var maxBtnLeft = self._maxBtn.getBoundingClientRect().left;
                var minBtnWidth = self._minBtn.getBoundingClientRect().width;
                var leftLineCoord = self._lineLeft.getBoundingClientRect().left;

                var middleLineWidth = maxBtnLeft - minBtnLeft;
                var leftLineWidth = minBtnLeft - leftLineCoord + minBtnWidth / 2;

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
                    self._lineMiddle.style.width = middleLineWidth + "px";
                    self._lineLeft.style.width = leftLineWidth + "px";
                    self._lineRight.style.width = lineWidth - leftLineWidth - middleLineWidth + "px";

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

                var minBtnLeft = self._minBtn.getBoundingClientRect().left;
                var maxBtnLeft = self._maxBtn.getBoundingClientRect().left;
                var maxBtnWidth = self._maxBtn.getBoundingClientRect().width;
                var leftLineCoord = self._lineLeft.getBoundingClientRect().left;

                var middleLineWidth = maxBtnLeft - minBtnLeft;
                var rightLineWidth = lineWidth - (maxBtnLeft - leftLineCoord) - maxBtnWidth / 2;

                if (coordX - maxBtnWidth >= minBtnCoordX) {
                    if (coordX < lineWidth) {
                        self._lineMiddle.style.width = middleLineWidth + "px";
                        self._lineRight.style.width = rightLineWidth + "px";
                        self._lineLeft.style.width = lineWidth - rightLineWidth - middleLineWidth + "px";
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
     * Возвращает максимальное и минимальное значения
     * @returns {[number, number]}
     */
    DoubleRange.prototype.getValues = function () {
        return [+this._minOutput.value, +this._maxOutput.value];
    };

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


    /**
     * Проверка _minOutput и _maxOutput на корректность
     * @returns {boolean}
     * @private
     */
    DoubleRange.prototype._inputValidate = function () {
        var regexp = /^-?\d+$/;

        // проверка на валидность _minOutput
        if (!regexp.test(this._minOutput.value)) {
            if (this._minOutput.value.length === 1) {
                if (this._minOutput.value !== "-") {
                    this._minOutput.value = this._min;
                }
            } else {
                this._minOutput.value = this._minOutput.value.slice(0, -1);
            }
            return false;
        }

        if (+this._minOutput.value < this._min || +this._minOutput.value > this._max)
            return false;

        // проверка на валидность _maxOutput
        if (!regexp.test(this._maxOutput.value)) {
            if (this._maxOutput.value.length === 1) {
                if (this._maxOutput.value !== "-") {
                    this._maxOutput.value = this._max;
                }
            } else {
                this._maxOutput.value = this._maxOutput.value.slice(0, -1);
            }
            return false;
        }

        if (+this._maxOutput.value < this._min || +this._maxOutput.value > this._max)
            return false;

        return true;
    };


    /**
     * Установить ползунок на заданное значение
     * @param {Element} btn
     * @param {string} value
     * @private
     */
    DoubleRange.prototype._setBtnPosition = function(btn, value) {
        var btnWidth = btn.getBoundingClientRect().width;
        btn.style.left = Math.floor((value - this._min) * this._divVal) - btnWidth / 2 + "px";
    };


    window.DoubleRange = DoubleRange;

})();
