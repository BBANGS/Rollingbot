/* ========================================================================
 * c-switch - v0.0.1
 * http://www.carnou.com/
 * ========================================================================
 * 
 * Developed by Mauro Baptista @carnou
 *
 * ========================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================================  
 */
    (function ( $ ) {
        /************************************************************************************************
        *
        * Function to make the transaction of element after click
        * (This function was made to avoid repetition on function c_switch_transition)
        *
        ************************************************************************************************/
        function standard_transition (id, color, transition, property) {
            $(id).css(property, color);
            $(id).css('transition-property', property);
            $(id).css('-webkit-transition', transition);
            $(id).css('-moz-transition', transition);
            $(id).css('-o-transition', transition);
            $(id).css('transition', transition);
        }
    
        /************************************************************************************************
        *
        * Function to make the transaction all elements attributes
        *
        ************************************************************************************************/
        function c_switch_transition (id, color, style, background_color, background_border, margin, duration, animation) {
            var group = (style != 'text')?'':'_group';
            if (style != 'text') {
                var transition = ' ' + duration/1000 +'s ' + animation;
                standard_transition('#c_' + id + '_switch', color, transition, 'background-color');
                if (background_color != 'transparent') standard_transition('#c_' + id + '_back', background_color, transition, 'background-color');
                standard_transition('#c_' + id + '_back', background_border, transition, 'border-color');
                standard_transition('#c_' + id + '_switch' + group, margin + 'px', transition, 'margin-left');
            } else if (style == 'text') {
                $('#c_' + id + '_switch' + group).animate({
                    marginLeft: margin + 'px'
                }, {
                    duration: duration,
                    easing: 'swing',
                    queue: false
                });
            }
        }
        
        /***********************************************************************************************/
        /************************************************************************************************
        **
        ** START OF C_SWITCH FUNCTION
        **
        ************************************************************************************************/
        /***********************************************************************************************/
    
        $.fn.c_switch = function(args) {
            
            var checked = 0;
            var css = '';
            
            /************************************************************************************************
            *
            * Define default values
            *
            ************************************************************************************************/

            var settings = $.extend({
                test: false,
                style: 'square',
                id: 'c_element',
                switch_color_on: '#008000',
                switch_color_off: '#444444',
                switch_class: '',
                switch_class_on: '',
                switch_class_off: '',
                background_color_on: 'transparent',
                background_color_off: 'transparent',
                background_border: '1px solid ',
                background_border_color_on: '#CCCCCC',
                background_border_color_off: '#CCCCCC',
                background_width: 40,
                background_height: 20,
                background_margin: 2,
                background_class: '',
                background_class_on: '',
                background_class_off: '',
                text_on: 'On',
                text_off: 'Off',
                duration: 500,
                animation: 'ease',
                zoom: 1
            }, args);
            
            /************************************************************************************************
            *
            * Get type of element (Radio or Checkbox)
            *
            ************************************************************************************************/
            
            var type = $(this).children('input:first').attr('type');
            
            /************************************************************************************************
            *
            * Show standard radio button (For debug purpose)
            *
            ************************************************************************************************/
            
            if(!settings.test) $(this).children().css( "display", "none" );
            
            /************************************************************************************************
            *
            * Define Switch style
            * if "text" goes to else
            * if not "text" add class c_<style>_back (current has round and square)
            *
            ************************************************************************************************/
            
            if (settings.style != 'text') {
                var append = ['<div id="c_', settings.id ,'_back" class="c_switch_inserted text c_' , settings.style, '_back" style="zoom:', (settings.zoom * 100) ,'%">',
                              '<div id="c_', settings.id ,'_switch" class="c_' , settings.style, '_toggle"></div>',
                              '</div>'];
            } else if (settings.style == 'text') {
                settings.switch_class_on = (settings.switch_class_on.length === 0)?'text_on':settings.switch_class_on;
                settings.switch_class_off = (settings.switch_class_off.length === 0)?'text_off':settings.switch_class_off;
                var append = ['<div id="c_', settings.id ,'_back" class="c_switch_inserted text c_' , settings.style, '_back" style="zoom:', (settings.zoom * 100) ,'%">',
                              '<div id="c_', settings.id ,'_switch_group" class="c_' ,settings.id, '_' , settings.style, '_toggle_text_group">',
                              '<div id="c_', settings.id ,'_switch_enabled" class="c_' , settings.id, '_' , settings.style, '_toggle_text"></div>',
                              '<div id="c_', settings.id ,'_switch_disabled" class="c_' , settings.id, '_' , settings.style, '_toggle_text"></div>',
                              '</div>','</div>'];
            }
            $(this).append(append.join(''));

            /************************************************************************************************
            *
            * Adjust Background Div
            *
            ************************************************************************************************/
            
            $('#c_' + settings.id + '_back').css({'width':settings.background_width + 'px', 'height':settings.background_height + 'px', 'margin':settings.background_margin + 'px', 'border':settings.background_border});
            $('#c_' + settings.id + '_back').addClass(settings.background_class);
            
            /************************************************************************************************
            *
            * Adjust Switch (If style is "text" it will goes to else)
            *
            ************************************************************************************************/

            if (settings.style != 'text') {
                var switch_width = parseFloat(settings.background_width / 2) - parseFloat(settings.background_margin * 2);
                var switch_height = parseFloat(settings.background_height) - parseFloat(settings.background_margin * 2);
                $('#c_' + settings.id + '_switch').css({'width':switch_width + 'px','height':switch_height + 'px','margin':settings.background_margin + 'px'});
                $('#c_' + settings.id + '_switch').addClass(settings.switch_class);
            } else if (settings.style == 'text') {
                $('#c_' + settings.id + '_back').css({'overflow':'hidden'});
                $('#c_' + settings.id + '_switch_enabled').html("<div class='c_align_middle'>" + settings.text_on + "</div>");
                $('#c_' + settings.id + '_switch_enabled').css({'float':'left','background-color': settings.background_color_on,'text-align': 'center'});
                $('#c_' + settings.id + '_switch_enabled').addClass(settings.switch_class).addClass(settings.switch_class_on);
                $('#c_' + settings.id + '_switch_disabled').html("<div class='c_align_middle'>" + settings.text_off + "</div>");
                $('#c_' + settings.id + '_switch_disabled').css({'float':'right','background-color':settings.background_color_off,'text-align':'center'});
                $('#c_' + settings.id + '_switch_disabled').addClass(settings.switch_class).addClass(settings.switch_class_off);
                
                
                /*
                 * When background width set as 'auto', first we will check the width of Switch Enabled and Switch Disabled elements,
                 * to get the higher value (Math.max) and use it as the background_width var
                 */
                
                if (settings.background_width == 'auto') {
                    var width_true = $('#c_' + settings.id + '_switch_enabled').outerWidth(true);
                    var width_false = $('#c_' + settings.id + '_switch_disabled').outerWidth(true);
                    settings.background_width = Math.max(width_true, width_false);

                    $('#c_' + settings.id + '_switch_enabled').css({'width': settings.background_width + 'px'});
                    $('#c_' + settings.id + '_switch_disabled').css({'width': settings.background_width + 'px'});
                    $('#c_' + settings.id + '_back').css({'width': settings.background_width + 'px'});
                }
                
                /*
                 * Change group width and toggle width (It will get the background_width from "auto", or it will get the defined value)
                 */
                
                var switch_group_width = parseFloat(settings.background_width * 2);
                $('#c_' + settings.id + '_switch_group').css({'width': switch_group_width + 'px'});
                $('.c_' + settings.id + '_' + settings.style + '_toggle_text').css({'width': settings.background_width + 'px','height': settings.background_height + 'px'});
            
            }
                        
            /************************************************************************************************
            *
            * Check if element is checked and give it the correct class
            *
            ************************************************************************************************/
            
            var margin_off = (parseFloat((settings.background_width/2)) + parseFloat((settings.background_margin)));
            var margin_on = settings.background_margin;

            checked = $(this).children('input:first').prop('checked');
            if (!checked) {
                $('#c_' + settings.id + '_back').addClass(settings.background_class_off).removeClass(settings.background_class_on);
                if (settings.style != 'text') {
                    $('#c_' + settings.id + '_switch').css({'margin-left':  margin_off + 'px','background-color': settings.switch_color_off});
                    $('#c_' + settings.id + '_switch').addClass(settings.switch_class_off).removeClass(settings.switch_class_on);
                    $('#c_' + settings.id + '_back').css({'background-color': settings.background_color_off,'border-color': settings.background_border_color_off});
                } else if (settings.style == 'text') {
                    $('#c_' + settings.id + '_switch_group').css({'margin-left': settings.background_width * (-1) + 'px'});
                }
            } else {
                $('#c_' + settings.id + '_back').addClass(settings.background_class_on).removeClass(settings.background_class_off);
                if (settings.style != 'text') {
                    $('#c_' + settings.id + '_switch').css({'margin-left': margin_on + 'px','background-color': settings.switch_color_on});
                    $('#c_' + settings.id + '_switch').addClass(settings.switch_class_on).removeClass(settings.switch_class_off);
                    $('#c_' + settings.id + '_back').css({'background-color': settings.background_color_on,'border-color': settings.background_border_color_on});
                } else if (settings.style == 'text') {
                    $('#c_' + settings.id + '_switch_group').css({'margin-left': '0px'});
                }
            }
            
            if (type == 'radio') {
                if (!checked) $(this).children('input:last').prop('checked', true);
            }
            
            /************************************************************************************************
            *
            * Toggle element on Click
            *
            ************************************************************************************************/
            
            $(this).on('click', function () {
                checked = $(this).children('input:first').prop('checked');

                if (settings.style != 'text') var margin = (checked)?margin_off:margin_on;
                else if (settings.style == 'text') var margin = (checked)?settings.background_width * (-1):0;
                var color = (checked)?settings.switch_color_off:settings.switch_color_on;
                var background_color = (checked)?settings.background_color_off:settings.background_color_on;
                var background_border = (checked)?settings.background_border_color_off:settings.background_border_color_on;
                c_switch_transition(settings.id, color, settings.style, background_color, background_border, margin, settings.duration, settings.animation);
                
                if (checked) {
                    $(this).children('input:first').prop('checked', false);
                    $('#c_' + settings.id + '_back').addClass(settings.background_class_off).removeClass(settings.background_class_on);
                    $('#c_' + settings.id + '_switch').addClass(settings.switch_class_off).removeClass(settings.switch_class_on);
                    if (type == 'radio') $(this).children('input:last').prop('checked', true);
                } else {
                    $(this).children('input:first').prop('checked', true);
                    $('#c_' + settings.id + '_back').addClass(settings.background_class_on).removeClass(settings.background_class_off);
                    $('#c_' + settings.id + '_switch').addClass(settings.switch_class_on).removeClass(settings.switch_class_off);
                    if (type == 'radio') $(this).children('input:last').prop('checked', false);
                }
            });
            return this;
        };
    } (jQuery));
