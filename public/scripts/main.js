function nestLog() {}

(function() {
    
    var   uri = '/dashboardjson'
        , options = {
            lines: {
                show: true
            },
            points: {
                show: false
            },
            xaxis: {
                mode: "time",
                axisLabel: "Time",
                axisLabelUseCanvas: true,
                axisLabelFontSizePixels: 12,
                axisLabelPadding: 5
            },
            yaxes: [
                {
                    axisLabel: "°C",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelPadding: 5
                },
                {
                    position: 0,
                    min: 0, max: 100,
                    axisLabel: "Humidity %",
                    axisLabelUseCanvas: true,
                    axisLabelFontSizePixels: 12,
                    axisLabelPadding: 5
                }
            ],
            legend: { position: 'nw' },
            grid: {
                hoverable: true,
                borderWidth: 1
            },
            axisLabels: {
                show: true
            }
        }
        , refreshTO = null
        , previousPoint = null
        , previousPointLabel = null;
    
    this.init = function() {
        loadData();
        bindHover();
    }
    
    function loadData() {
        
        clearTimeout(refreshTO);
        
        $.ajax({
            url: uri,
            type: "GET",
            dataType: "json",
            success: function(data) {

                var series = [
                    { data: data[0], label: "Temp" },
                    { data: data[2], label: "Target", lines: { show: true, steps: true } },
                    { data: data[1], label: "Humidity", yaxis: 2 }
                ];

                $.plot("#graph", series, options);

            }
        }).always(function() {
            
            clearTimeout(refreshTO);
            refreshTO = setTimeout(function() { loadData(); }, 300000);
            
        });
    }
    
    function showTooltip(x, y, contents, z) {
        $('<div id="flot-tooltip">' + contents + '</div>').css({
            position: 'absolute',
            display: 'none',
            top: y - 30,
            left: x + 30,
            border: '2px solid',
            padding: '2px',
            'background-color': '#FFF',
            opacity: 0.80,
            'border-color': z,
            '-moz-border-radius': '5px',
            '-webkit-border-radius': '5px',
            '-khtml-border-radius': '5px',
            'border-radius': '5px'
        }).appendTo("body").fadeIn(200);
    }
    
    function convertToDate(timestamp) {
        var newDate = new Date(timestamp),
            mins = newDate.getMinutes(),
            hours = newDate.getHours(),
            dateString;
        
        if (mins  < 10) { mins  = '0' + mins ; }
        if (hours < 10) { hours = '0' + hours; }
        
        dateString = newDate.getDate() + '-' + (newDate.getMonth()+1) + '-' + newDate.getFullYear() + ' ' + hours + ':' + mins

        return dateString;
    }
    
    function bindHover() {
        $("#graph").bind("plothover", function (event, pos, item) {
            if (item) {
                if ((previousPoint != item.dataIndex) || (previousLabel != item.series.label)) {
                    previousPoint = item.dataIndex;
                    previousLabel = item.series.label;

                    $("#flot-tooltip").remove();

                    if (item.series.label == "Temp") {
                        var unitLabel = "°C";
                    } else if (item.series.label == "Target") {
                        var unitLabel = "°C";
                    } else if (item.series.label == "Humidity") {
                        var unitLabel = "%";
                    }

                    var x = convertToDate(item.datapoint[0]),
                        y = item.datapoint[1],
                        z = item.series.color;

                    showTooltip(item.pageX, item.pageY,
                            "<b>" + item.series.label + "</b><br /> " + x + " = " + y + unitLabel,
                            z);
                }
            } else {
                $("#flot-tooltip").remove();
                previousPoint = null;
            }
        });
    }
    
}).apply(nestLog);

$(document).ready(function() {
    nestLog.init();
});