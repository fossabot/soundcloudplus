/*jslint browser: true, white: true*/
(function() {

    function setVal(opt, val) {
        opt = $(opt);
        if (opt.attr("type") === "checkbox") {
            opt.prop("checked", val === true || val === "true" ? true : false);
        } else {
            opt.val(val);
        }
    }

    function load() {
        setVal(this, localStorage[$(this).attr("id")]);
    }

    function save() {
        var opt = $(this);
        var val;

        if (opt.attr("type") === "checkbox") {
            val = opt.is(":checked").toString();
        } else {
            val = opt.val();
        }

        localStorage[opt.attr("id")] = val;
    }

    /**
     * If option is not available in localStorage, default value
     * will be loaded from DOM object and put into storage.
     */
    function defaultValue() {
        var opt = $(this);
        if (!localStorage[opt.attr("id")]) {
            localStorage[opt.attr("id")] = opt.data("default");
        }
    }


    $("input, select, textarea")
        .each(defaultValue)
        .each(load)
        .keyup(save)
        .change(save)
        .click(save);

    $("#reset").click(function() {
        $("input, select, textarea")
            .each(function() {
                setVal(this, $(this).data("default"));
            })
            .each(save);
    });

}());
