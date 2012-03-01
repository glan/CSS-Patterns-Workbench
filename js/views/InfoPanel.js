define('views/InfoPanel', ['models/Rect'], function (Rect) {

    function InfoPanel() {
        //$('#info-panel').unbind();
        document.getElementById('info-panel').addEventListener('input', this);
        document.getElementById('info-panel').addEventListener('change', this);
        document.getElementById('info-panel').addEventListener('mousedown', function (event) {
             event.stopPropagation();
        });
    }

    var infoPanel = {
        setRect : function (rect) {
            this.rect = rect;
            document.getElementById('info_size_width').value = rect.getWidth().getValue();
            document.getElementById('info_size_width_unit').value = rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = rect.getHeight().getValue();
            document.getElementById('info_size_height_unit').value = rect.getHeight().getUnit();
            document.getElementById('info_position_x').value = rect.getLeft().getValue();
            document.getElementById('info_position_x_unit').value = rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = rect.getTop().getValue();
            document.getElementById('info_position_y_unit').value = rect.getTop().getUnit();
        },
        handleEvent : function (event) {
            var spawnEvent = document.createEvent('UIEvents');

            this.rect.getWidth().setValue(document.getElementById('info_size_width').value);
            this.rect.getWidth().setUnit(document.getElementById('info_size_width_unit').value);
            this.rect.getHeight().setValue(document.getElementById('info_size_height').value);
            this.rect.getHeight().setUnit(document.getElementById('info_size_height_unit').value);
            this.rect.getLeft().setValue(document.getElementById('info_position_x').value);
            this.rect.getLeft().setUnit(document.getElementById('info_position_x_unit').value);
            this.rect.getTop().setValue(document.getElementById('info_position_y').value);
            this.rect.getTop().setUnit(document.getElementById('info_position_y_unit').value);
            
            spawnEvent.initUIEvent('infopanel_update', true, true, this.domElement, 1);
            spawnEvent.rect = this.rect;
            document.dispatchEvent(spawnEvent);
        },
        show : function () {
            $(document.getElementById('info-panel')).addClass('show');
        },
        hide : function () {
            $(document.getElementById('info-panel')).removeClass('show');
        }
    }

    InfoPanel.prototype = infoPanel;
    return InfoPanel;

});