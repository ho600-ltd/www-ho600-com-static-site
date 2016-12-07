function save_to_canvas (){
    /*
     * to canvas type
     * use <script src="/media/base64.js"></script>
     */
    var svg = $("#holder").html();
    canvg('holder_image', svg, {ignoreMouse: true, ignoreAnimation: true});
    var canvas = document.getElementById('holder_image');
    var context = canvas.getContext('2d');
    context.font = 'bold 16px sans-serif';
    context.fillStyle = 'blue';
    context.fillText('snapshot at '+new Date(), 450, 20);

    var $dialog = $('#holder_image_dialog');
    $dialog.dialog({
        title: 'Drawing in Canvas',
        width: parseInt($dialog.width() * 1.2),
        height: parseInt($dialog.height() * 1.2),
        buttons: {
            'Save to PNG': save_to_png,
            'Close': function () {$(this).dialog('close');}
        }
    });

    /*
     * to link style
     *
     * use <script src="/media/webkit.base64.js"></script>
    $("svg").attr({ version: '1.1' , xmlns:"http://www.w3.org/2000/svg"});

    var b64 = Base64.encode(svg);
    $("#holder_image").find('img').remove().end().append(
        $("<a target='chart' href-lang='image/svg+xml' href='data:image/svg+xml;base64,\n"
            +b64
            +"' title='chart.svg'><img src='data:image/svg+xml;base64,\n"
            +b64
            +"' alt='chart.svg'/></a>"));
     */
}


function save_to_png () {
    var oCanvas = document.getElementById("holder_image");
    Canvas2Image.saveAsPNG(oCanvas);
}


function DrawWithRaphael (div_id) {
    this.div_id = div_id;
    this.R = Raphael(div_id);
}


DrawWithRaphael.prototype = {
    clear: function () {
        this.R.clear();
        return this;
    },
    import_data: function (data) {
        if (!data.lines) { throw this; }

        this.data = {
            lines: data.lines,
            'background-color': data['background-color'] ? data['background-color'] : 'white',
            width: data.width ? data.width : 960,
            height: data.height ? data.height : 600,
            radius: data.radius ? data.radius : 10,
            margin: data.margin ? data.margin : [50, 50, 50, 50], //L R T B
            axis_x_max: data.axis_x_max ? data.axis_x_max : 2000,
            nostroke: data.nostroke ? data.nostroke : false,
            axis: data.axis ? data.axis : "0 0 1 1",
            x_label: {
                x: data.x_label.x ? data.x_label.x : 200,
                y: data.x_label.y ? data.x_label.y : 80,
                name: data.x_label.name ? data.x_label.name : 'X',
                font: data.x_label.font ? data.x_label.font : '22px sans-serif',
                fill: data.x_label.fill ? data.x_label.fill : 'red'
            },
            y_label: {
                x: data.y_label.x ? data.y_label.x : 20,
                y: data.y_label.y ? data.y_label.y : 200,
                name: data.y_label.name ? data.y_label.name : 'Y',
                font: data.y_label.font ? data.y_label.font : '22px sans-serif',
                fill: data.y_label.fill ? data.y_label.fill : 'red'
            },
            title: {
                x: data.title.x ? data.title.x : 800,
                y: data.title.y ? data.title.y : 580,
                name: data.title.name ? data.title.name : 'LSM Chart',
                font: data.title.font ? data.title.font : '22px sans-serif',
                fill: data.title.fill ? data.title.fill : '#969696'
            },
            shade: data.shade ? data.shade : false,
            dash: data.dash ? data.dash : '',
            symbol: { type: data.symbol.type ? data.symbol.type : 'circle',
                radius: data.symbol.radius ? data.symbol.radius : 4 },
            smooth: data.smooth ? data.smooth : false
        }
        return this;
    },
    set_background: function () {
        var d = this.data;
        this.R.rect(0, 0, d.width, d.height, d.radius).attr({fill: d['background-color']});
        return this;
    },
    draw_title: function () {
        var d = this.data;
        this.R.text(d.title.x, d.title.y, d.title.name).attr(d.title);
        return this;
    },
    draw_x_lable: function () {
        var d = this.data;
        this.R.text(d.x_label.x, d.x_label.y, d.x_label.name).attr(d.x_label);
        return this;
    },
    draw_y_lable: function () {
        var d = this.data;
        this.R.text(d.y_label.x, d.y_label.y, d.y_label.name).attr(d.y_label).rotate(90);
        return this;
    },
    draw_lines: function () {
        var R = this.R;
        var d = this.data;
        var x_pos = d.margin[0];
        var y_pos = d.margin[1];
        var margin = d.margin;
        var Ls = d.lines;
        var x_array = [];
        var y_array = [];
        var max_x = 0;
        var max_y = 0;

        for (var i=0; i<Ls.length; i++){
            var L = Ls[i];
            var xs = [];
            var ys = [];
            for (var j=0; j<L.length; j++){
                var x = L[j][0];
                var y = L[j][1];
                if (x > max_x) {
                    max_x = x;
                }
                if (y > max_y) {
                    max_y = y;
                }
                xs.push(x);
                ys.push(y);
            }
            x_array.push(xs);
            y_array.push(ys);
        }
        if (max_x < d.axis_x_max) {
            max_x = d.axis_x_max;
        }
        var axisystep = Math.ceil(max_y);
        var scale = 100; // #TODO this scale value must depend on max_x;
        var axisxstep = Math.ceil(max_x / scale);
        x_array.unshift([0, 0, axisxstep * scale]);
        y_array.unshift([axisystep, 0, 0]);
        console.log(max_x);
        console.log(max_y);
        console.log(axisxstep);
        console.log(axisystep);
        console.log(x_pos);
        console.log(y_pos);
        console.log(d.width - margin[0] - margin[1]);
        console.log(d.height - margin[2] - margin[3]);

        var lines = R.linechart(x_pos, y_pos,
                                    d.width - margin[0] - margin[1],
                                    d.height - margin[2] - margin[3],
                                    x_array, y_array,
                                    {nostroke: d.nostroke,
                                        axis: d.axis,
                                        axisystep: axisystep,
                                        axisxstep: axisxstep,
                                        shade: d.shade,
                                        dash: d.dash,
                                        symbol: d.symbol.type, smooth: d.smooth}
            ).hover(function () {
                this.tag = R.tag(this.x, this.y, '('+this.value+', '+this.axis+')').insertBefore(this);
            }, function () {
                if (true != this.tag.lock) {
                    this.tag.animate({opacity: 0}, 300, function () {
                        this.remove();
                    });
                }
            }).click(function() {
                this.tag.lock = true;
            });
        lines.symbols.attr({ r: d.symbol.radius });
    }
}


function import_data () {
    var lsm_data = $.parseJSON($('#LSM_data').val());
    dwr.clear().import_data(lsm_data).set_background().draw_title().draw_x_lable().draw_y_lable().draw_lines();
}

var dwr;
$(document).ready(function () {
    dwr = new DrawWithRaphael('holder');
    $('.import_data').click(import_data);
    $('.save_to_canvas').click(save_to_canvas);
});