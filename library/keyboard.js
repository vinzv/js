var TurtlKeyboard = Composer.Event.extend({
	_key_listener: null,

	initialize: function()
	{
		if(!this._key_listener)
		{
			this._key_listener = this.keydown.bind(this);
		}
	},

	attach: function()
	{
		document.body.addEvent('keydown', this._key_listener);
		return this;
	},

	detach: function()
	{
		document.body.removeEvent('keydown', this._key_listener);
		return this;
	},

	keydown: function(e)
	{
		this.trigger('raw', {
			key: e.key,
			code: e.code,
			shift: e.shift,
			meta: e.meta,
			control: e.control,
			alt: e.alt
		});

		var key = e.key;
		var mods = [
			e.shift && 'shift',
			e.meta && 'meta',
			e.control && 'control',
			e.alt && 'alt'
		].filter(function(mod) { return !!mod; })
			.sort(function(a, b) { return a.localeCompare(b); });

		if(mods.indexOf(key) < 0) mods.push(key);
		var ev = mods.join('+').toLowerCase();
		this.trigger(ev);
	}
});

