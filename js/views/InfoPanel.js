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
        setData : function (layer) {
            this.rect = layer.getRect();
            document.getElementById('info_size_width').value = this.rect.getWidth().getValue();
            document.getElementById('info_size_width_unit').value = this.rect.getWidth().getUnit();
            document.getElementById('info_size_height').value = this.rect.getHeight().getValue();
            document.getElementById('info_size_height_unit').value = this.rect.getHeight().getUnit();
            document.getElementById('info_position_x').value =this. rect.getLeft().getValue();
            document.getElementById('info_position_x_unit').value = this.rect.getLeft().getUnit();
            document.getElementById('info_position_y').value = this.rect.getTop().getValue();
            document.getElementById('info_position_y_unit').value = this.rect.getTop().getUnit();
            document.getElementById('info_repeating').checked = layer.getRepeating();
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
            spawnEvent.repeating = document.getElementById('info_repeating').checked;
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