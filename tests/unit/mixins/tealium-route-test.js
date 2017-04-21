import Ember from 'ember';
import TealiumRouteMixin, { DEFAULT_VIEW } from 'ember-tracker/mixins/tealium-route';
import { module, test } from 'qunit';

const {
	Evented,
	assign,
} = Ember;

module('Unit | Mixin | tealium route');

test('should initialize variables then look for `utag` on the window', function(assert) {
	let looked = false;
  const TealiumRouteObject = Ember.Object.extend(TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		// This must be part of every test. Otherwise you'll infinitely loop looking for it.
		_etCheckForUtag() {
			looked = true;
		},
	});
  assert.equal(subject.get('_etLastView'), null, 'should be initialized to null');
  assert.equal(subject.get('_tealium'), null, 'should be initialized to null');
	assert.ok(looked, 'should be called');
});

test('didTransition should assign `_etLastView` if tealium isnt available yet', function(assert) {
	const route = Ember.Object.create({
		route: 'yep',
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		// This must be part of every test. Otherwise you'll infinitely loop looking for it.
		_etCheckForUtag() {},
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.trigger('didTransition');

	assert.deepEqual(subject.get('_etLastView'), DEFAULT_VIEW, 'it should be saved in the lastview var');
});

test('didTransition should merge DEFAULT_VIEW and object that comes back from getTealiumView', function(assert) {
	const route = Ember.Object.create({
		getTealiumView() {
			return {
				order_currency: 'CAD',
				page_type: 'list',
				new_param: 'yep',
			};
		},
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		// This must be part of every test. Otherwise you'll infinitely loop looking for it.
		_etCheckForUtag() {},
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.trigger('didTransition');

	const view = assign({}, DEFAULT_VIEW, {
			order_currency: 'CAD',
			page_type: 'list',
			new_param: 'yep',
	});

	assert.deepEqual(subject.get('_etLastView'), view, 'they should be merged');
});

test('didTransition should send the view to tealium if available', function(assert) {
	const route = Ember.Object.create({
		route: 'yep',
	});
  const TealiumRouteObject = Ember.Object.extend(Evented, TealiumRouteMixin);
  const subject = TealiumRouteObject.create({
		// This must be part of every test. Otherwise you'll infinitely loop looking for it.
		_etCheckForUtag() {},
		_etGetCurrentRoute() {
			return route;
		},
	});

	subject.set('_tealium', {
		view(data) {
			assert.deepEqual(data, DEFAULT_VIEW, 'it should send the correct data to the view method for tealium');
		},
	});

	subject.trigger('didTransition');
});
