'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
	return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then((urls) => {
    return {
			useYarn: true,
			scenarios: [
				{
					name: 'ember-lts-3.2',
					env: {
						EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': false })
					},
					npm: {
						devDependencies: {
							'ember-source': '~3.4.0'
						}
					}
				},
				{
					name: 'ember-lts-3.4',
					env: {
						EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': false })
					},
					npm: {
						devDependencies: {
							'ember-source': '~3.4.0'
						}
					}
				},
				{
					name: 'ember-lts-3.8',
					env: {
						EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': true })
					},
					npm: {
						devDependencies: {
							'ember-source': '~2.18.0',
							'ember-jquery': '^0.5.1'
						}
					}
				},
				{
					name: 'ember-release',
					npm: {
						devDependencies: {
							'ember-source': urls[0]
						}
					}
				},
				{
					name: 'ember-beta',
					npm: {
						devDependencies: {
							'ember-source': urls[1]
						}
					}
				},
				{
					name: 'ember-canary',
					npm: {
						devDependencies: {
							'ember-source': urls[2]
						}
					}
				},
				{
					name: 'ember-default-with-jquery',
					env: {
						EMBER_OPTIONAL_FEATURES: JSON.stringify({
							'jquery-integration': true
						})
					},
					npm: {
						devDependencies: {
							'@ember/jquery': '^0.5.1'
						}
					}
				}
			]
		};
	});
};
