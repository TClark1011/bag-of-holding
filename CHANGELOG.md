# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [1.2.2](https://github.com/TClark1011/bag-of-holding/compare/v1.2.1...v1.2.2) (2022-03-30)


### Bug Fixes

* **fullstack:** 🐛 fixed how frontend essential env vars load ([2b561a6](https://github.com/TClark1011/bag-of-holding/commit/2b561a6cc7b50bc83621c655461595f56855cd1f))

### [1.2.1](https://github.com/TClark1011/bag-of-holding/compare/v1.2.0...v1.2.1) (2022-03-30)


### Bug Fixes

* **frontend:** 🐛 color mode button now uses correct icons ([7e63a91](https://github.com/TClark1011/bag-of-holding/commit/7e63a91f8fc6361e82453935020fb9c6d7b98b0e))
* **frontend:** 🐛 default color mode now uses client preferences ([37f1d38](https://github.com/TClark1011/bag-of-holding/commit/37f1d381571101713d5d486ad4eb53619b45d971))
* **frontend:** 🐛 fixed (or at least improved) color mode flash ([66cf91c](https://github.com/TClark1011/bag-of-holding/commit/66cf91cf9e396ba1b979e3f7083668b57ee68c27)), closes [#127](https://github.com/TClark1011/bag-of-holding/issues/127)
* **frontend:** 🐛 fixed how system color mode is applied ([468c028](https://github.com/TClark1011/bag-of-holding/commit/468c028f0baf745dfb870d22621997e702a1060b))

## [1.2.0](https://github.com/TClark1011/bag-of-holding/compare/v1.1.3...v1.2.0) (2022-03-28)


### Features

* **frontend:** 🎸 setup hookstate devtools ([28ac5a4](https://github.com/TClark1011/bag-of-holding/commit/28ac5a4a4b82e5584691ca645395972685deafd2))


### Bug Fixes

* **frontend:** 🐛 all numeric fields should now sort correctly ([3e0a482](https://github.com/TClark1011/bag-of-holding/commit/3e0a482e456edbe3782a99c3b764e286f1217e1d))
* **workspace:** fixed next.js config ([e11005e](https://github.com/TClark1011/bag-of-holding/commit/e11005eecd150adacf6354c3b4243216a9bcc594))

### [1.1.4](https://github.com/TClark1011/bag-of-holding/compare/v1.1.3...v1.1.4) (2021-08-15)

### [1.1.3](https://github.com/TClark1011/bag-of-holding/compare/v1.1.2...v1.1.3) (2021-07-25)


### Bug Fixes

* **frontend:** :bug: searching is no longer case sensitive ([f706411](https://github.com/TClark1011/bag-of-holding/commit/f706411380218b40061de07920a57338977a3921))

### [1.1.2](https://github.com/TClark1011/bag-of-holding/compare/v1.1.1...v1.1.2) (2021-07-25)


### Bug Fixes

* **frontend:** :bug: fixed my bad fix ([cc6433d](https://github.com/TClark1011/bag-of-holding/commit/cc6433df44d0038e9e28a1438ccfe32ce24b7852))

### 1.1.1 (2021-07-25)


### Features

* **backend:** :sparkles: db reducer now handles "setToNobody" member removal method ([55db0c9](https://github.com/TClark1011/bag-of-holding/commit/55db0c97659d89451bde12a2b344b5bd12b442f0))
* **backend:** :sparkles: dbReducer can now handle updates to members ([7c3a032](https://github.com/TClark1011/bag-of-holding/commit/7c3a032b40d773a89d1a2e32604dfc1b1d531e7b))
* **frontend:** :construction_worker: Created 'ItemGiveToSelect' component ([405e82b](https://github.com/TClark1011/bag-of-holding/commit/405e82b7ab8ade4e577677d9a7516eb40181e2dd))
* **frontend:** :construction_worker: removed horizontal padding from View ([e1fcf08](https://github.com/TClark1011/bag-of-holding/commit/e1fcf089844c3308e7a665c0e9cc321fb77695ff))
* **frontend:** :construction: item table totals now use compute functions ([86ef2ec](https://github.com/TClark1011/bag-of-holding/commit/86ef2ecc521f2be1d4d7a2978a60c341ee2136cd))
* **frontend:** :construction: items in table use calculation functions ([c1989d9](https://github.com/TClark1011/bag-of-holding/commit/c1989d962088a1aa7451b67646e8c0f758e0d190))
* **frontend:** :lipstick: implemented working UI for member delete method selection ([9bdcbe9](https://github.com/TClark1011/bag-of-holding/commit/9bdcbe9c7c70612410b7bbf483659e1006277069))
* **frontend:** :sparkles: added link to subreddit ([5abb140](https://github.com/TClark1011/bag-of-holding/commit/5abb14055f3d2719bb7c0284ad36fcda6ace4909))
* **frontend:** :sparkles: GetStartedButton returns maintenance message when app is in maintenance ([170d4b4](https://github.com/TClark1011/bag-of-holding/commit/170d4b4bd999ff822514a7cc4e9264640c6a60da))
* **frontend:** :sparkles: implemented fallback value feature to 'PartyMemberData' component ([3d99643](https://github.com/TClark1011/bag-of-holding/commit/3d99643008cb99813122036a0c7a01a4e50116ad))
* **fullstack:** :card_file_box: sheet model will not enforce a schema during data migration ([268089a](https://github.com/TClark1011/bag-of-holding/commit/268089ac0c81fb908d4fd8c0dc9b636836998db3))
* **fullstack:** :construction: created functions for calculating item weight/value ([bd4b984](https://github.com/TClark1011/bag-of-holding/commit/bd4b9847814a2d42790c460690e08476c41ad5a9))
* **fullstack:** :construction: implemented initial partial metadata updates ([4c611ad](https://github.com/TClark1011/bag-of-holding/commit/4c611ad23e7ec6bd6525730826a02b5996c9fe2b))
* **fullstack:** :sparkles: created util fn for checking if a member is carrying a certain item ([7c1d8b5](https://github.com/TClark1011/bag-of-holding/commit/7c1d8b5b416d7aa066681f7e07c929f285fdd86a))
* **fullstack:** :sparkles: publicEnv.ts exports `MAINTENANCE_MODE` variable ([e95f52b](https://github.com/TClark1011/bag-of-holding/commit/e95f52b98f03e2bb64b449a3f00557fbc26bbac5))
* **fullstack:** :sparkles: reducers now handle 'remove' member delete method ([127203b](https://github.com/TClark1011/bag-of-holding/commit/127203b185fbeeae0cd51468ff5d658451aa83a2))
* **fullstack:** :wrench: `env` config file now exports migration indication variable ([6d26c3b](https://github.com/TClark1011/bag-of-holding/commit/6d26c3be8584c9508a37e204a898ddad457bd684))


### Bug Fixes

* **backend:** :bug: fixed bug where only first item would be moved from removing member ([d3f6ab4](https://github.com/TClark1011/bag-of-holding/commit/d3f6ab44e1f7b12fc34f2b205454635da2618329))
* **backend:** :bug: fixed db tests ([ee6edfd](https://github.com/TClark1011/bag-of-holding/commit/ee6edfdfa98c6ab7cdbfd2e1f071194b990e533a))
* **backend:** :fire: attempting to fix tests when run via github actions ([9ad9948](https://github.com/TClark1011/bag-of-holding/commit/9ad994802e76d6ad3b16b9c833e2d698d020eadb))
* **frontend:** :bug: filter interface now correctly shows member names instead of ids ([fb3121c](https://github.com/TClark1011/bag-of-holding/commit/fb3121ccdebfd1049230f6b22b7200010f407c26))
* **frontend:** :bug: fixed bug that caused sortying by carriedBy to not work correctly ([24980e0](https://github.com/TClark1011/bag-of-holding/commit/24980e08c878312fba44ba39915a49b609a9fb91))
* **frontend:** :bug: fixed sheet validation to work with member objects ([e6ef6df](https://github.com/TClark1011/bag-of-holding/commit/e6ef6df584bdc2d57b69bf93ab29bc3c74baec7f))
* **frontend:** :bug: implemented bigjs to calculate member totals ([2cf5ac2](https://github.com/TClark1011/bag-of-holding/commit/2cf5ac25fa0fc62602727d4a5edda71c6c997483))
* **frontend:** :bug: inventory state reducer now actually handles party member updates ([9c6469f](https://github.com/TClark1011/bag-of-holding/commit/9c6469faecc6187813dcfb556474eecd2f1f1f41))
* **frontend:** :speech_balloon: fixed typo on on info page ([d7d0091](https://github.com/TClark1011/bag-of-holding/commit/d7d0091fd460d00e2223f93cc766402841a8bf3e))
* **frontend:** update sheet options color mode ([8b727e8](https://github.com/TClark1011/bag-of-holding/commit/8b727e80f6d244e043d6708882b66c80f07681cc)), closes [#1](https://github.com/TClark1011/bag-of-holding/issues/1)
* **fullstack:** :label: updated some member delete code to use enums for member delete methods ([83649ce](https://github.com/TClark1011/bag-of-holding/commit/83649ce5e83db225163a878a628dfca5c134d90e))
* **scripts:** :bug: 'setupDevDb' script no longer hangs ([c17dad7](https://github.com/TClark1011/bag-of-holding/commit/c17dad7f50afd7dea257865567c64d2cdf725c3e))
* **scripts:** fix grammar in welcome dialog ([14ce3df](https://github.com/TClark1011/bag-of-holding/commit/14ce3dff17bdad6584cf6fbe274d8a53c724d8f0))
* **workspace:** :bug: (hopefully) fixed testing github action ([265b9b2](https://github.com/TClark1011/bag-of-holding/commit/265b9b2249a30565f3709303ec47a06a528e4d0d))
* **workspace:** :bug: added mock env variables to github test action ([3f979ef](https://github.com/TClark1011/bag-of-holding/commit/3f979ef5491cd17be0142aff4d0f7e32f718d5ea))
* **workspace:** :bug: github actions ([fe3b0ee](https://github.com/TClark1011/bag-of-holding/commit/fe3b0ee5dce2911e93987cb404a71492016cd524))
* **workspace:** :bug: github actions ;( ([2a66d80](https://github.com/TClark1011/bag-of-holding/commit/2a66d8003a8df31836951a3cdc56245ce41583ba))
* **workspace:** :bug: github actions ! ([1aaf8a7](https://github.com/TClark1011/bag-of-holding/commit/1aaf8a7d6d49d312e515d0b1f703be7a8de410dc))
* **workspace:** :bug: more github action stuff ([16dc38a](https://github.com/TClark1011/bag-of-holding/commit/16dc38a532131856cb5d41c468807bdecb8d50be))
* **workspace:** :bug: more github test action fixes ([d211306](https://github.com/TClark1011/bag-of-holding/commit/d21130604e02bc9df6976c0a40bc03ab6356721f))
* **workspace:** :bug: moved assets folder inside src folder ([f61079b](https://github.com/TClark1011/bag-of-holding/commit/f61079be84d2a67348af77abd9bf1023c7b5a688))
* **workspace:** :bug: tripe jest timeout ([16f68e6](https://github.com/TClark1011/bag-of-holding/commit/16f68e6f89ead29ab49c5559994d4e985bfe4272))
* **workspace:** :fire: removed empty sheet model file ([c2674dc](https://github.com/TClark1011/bag-of-holding/commit/c2674dc1c81dcdb9477e9fbb8282826286c54f17))
* **workspace:** :fire: removed prod blocker ([0815f14](https://github.com/TClark1011/bag-of-holding/commit/0815f14dfd4bf427cf0a5f502d8570598f023cb6))
* :bug: HOTFIX: added timestamps to sheet schema ([62d4769](https://github.com/TClark1011/bag-of-holding/commit/62d4769bfb85fceb3f4ba83c0623739b1649391a))
* **workspace:** :heavy_plus_sign: added missing type definition package ([29ef250](https://github.com/TClark1011/bag-of-holding/commit/29ef2503c06c2ab1061f55724959606ef65ae649))
* **workspace:** :wrench: setup pre install hook to run husky ([6e3012f](https://github.com/TClark1011/bag-of-holding/commit/6e3012fcaa994f6d47491c155f811ba4c1c9b9e2))

## [1.1.0](https://github.com/TClark1011/bag-of-holding/compare/v1.0.2...v1.2.0) (2021-06-26)


### Features

* **backend:** :sparkles: db reducer now handles "setToNobody" member removal method ([55db0c9](https://github.com/TClark1011/bag-of-holding/commit/55db0c97659d89451bde12a2b344b5bd12b442f0))
* **backend:** :sparkles: dbReducer can now handle updates to members ([7c3a032](https://github.com/TClark1011/bag-of-holding/commit/7c3a032b40d773a89d1a2e32604dfc1b1d531e7b))
* **frontend:** :construction_worker: Created 'ItemGiveToSelect' component ([405e82b](https://github.com/TClark1011/bag-of-holding/commit/405e82b7ab8ade4e577677d9a7516eb40181e2dd))
* **frontend:** :construction_worker: removed horizontal padding from View ([e1fcf08](https://github.com/TClark1011/bag-of-holding/commit/e1fcf089844c3308e7a665c0e9cc321fb77695ff))
* **frontend:** :construction: item table totals now use compute functions ([86ef2ec](https://github.com/TClark1011/bag-of-holding/commit/86ef2ecc521f2be1d4d7a2978a60c341ee2136cd))
* **frontend:** :construction: items in table use calculation functions ([c1989d9](https://github.com/TClark1011/bag-of-holding/commit/c1989d962088a1aa7451b67646e8c0f758e0d190))
* **frontend:** :lipstick: implemented working UI for member delete method selection ([9bdcbe9](https://github.com/TClark1011/bag-of-holding/commit/9bdcbe9c7c70612410b7bbf483659e1006277069))
* **frontend:** :sparkles: added link to subreddit ([5abb140](https://github.com/TClark1011/bag-of-holding/commit/5abb14055f3d2719bb7c0284ad36fcda6ace4909))
* **frontend:** :sparkles: GetStartedButton returns maintenance message when app is in maintenance ([170d4b4](https://github.com/TClark1011/bag-of-holding/commit/170d4b4bd999ff822514a7cc4e9264640c6a60da))
* **frontend:** :sparkles: implemented fallback value feature to 'PartyMemberData' component ([3d99643](https://github.com/TClark1011/bag-of-holding/commit/3d99643008cb99813122036a0c7a01a4e50116ad))
* **fullstack:** :card_file_box: sheet model will not enforce a schema during data migration ([268089a](https://github.com/TClark1011/bag-of-holding/commit/268089ac0c81fb908d4fd8c0dc9b636836998db3))
* **fullstack:** :construction: created functions for calculating item weight/value ([bd4b984](https://github.com/TClark1011/bag-of-holding/commit/bd4b9847814a2d42790c460690e08476c41ad5a9))
* **fullstack:** :construction: implemented initial partial metadata updates ([4c611ad](https://github.com/TClark1011/bag-of-holding/commit/4c611ad23e7ec6bd6525730826a02b5996c9fe2b))
* **fullstack:** :sparkles: created util fn for checking if a member is carrying a certain item ([7c1d8b5](https://github.com/TClark1011/bag-of-holding/commit/7c1d8b5b416d7aa066681f7e07c929f285fdd86a))
* **fullstack:** :sparkles: publicEnv.ts exports `MAINTENANCE_MODE` variable ([e95f52b](https://github.com/TClark1011/bag-of-holding/commit/e95f52b98f03e2bb64b449a3f00557fbc26bbac5))
* **fullstack:** :sparkles: reducers now handle 'remove' member delete method ([127203b](https://github.com/TClark1011/bag-of-holding/commit/127203b185fbeeae0cd51468ff5d658451aa83a2))
* **fullstack:** :wrench: `env` config file now exports migration indication variable ([6d26c3b](https://github.com/TClark1011/bag-of-holding/commit/6d26c3be8584c9508a37e204a898ddad457bd684))


### Bug Fixes

* **backend:** :bug: fixed bug where only first item would be moved from removing member ([d3f6ab4](https://github.com/TClark1011/bag-of-holding/commit/d3f6ab44e1f7b12fc34f2b205454635da2618329))
* **backend:** :bug: fixed db tests ([ee6edfd](https://github.com/TClark1011/bag-of-holding/commit/ee6edfdfa98c6ab7cdbfd2e1f071194b990e533a))
* **backend:** :fire: attempting to fix tests when run via github actions ([9ad9948](https://github.com/TClark1011/bag-of-holding/commit/9ad994802e76d6ad3b16b9c833e2d698d020eadb))
* **frontend:** :bug: filter interface now correctly shows member names instead of ids ([fb3121c](https://github.com/TClark1011/bag-of-holding/commit/fb3121ccdebfd1049230f6b22b7200010f407c26))
* **frontend:** :bug: fixed sheet validation to work with member objects ([e6ef6df](https://github.com/TClark1011/bag-of-holding/commit/e6ef6df584bdc2d57b69bf93ab29bc3c74baec7f))
* **frontend:** :bug: implemented bigjs to calculate member totals ([2cf5ac2](https://github.com/TClark1011/bag-of-holding/commit/2cf5ac25fa0fc62602727d4a5edda71c6c997483))
* **frontend:** :bug: inventory state reducer now actually handles party member updates ([9c6469f](https://github.com/TClark1011/bag-of-holding/commit/9c6469faecc6187813dcfb556474eecd2f1f1f41))
* **frontend:** :speech_balloon: fixed typo on on info page ([d7d0091](https://github.com/TClark1011/bag-of-holding/commit/d7d0091fd460d00e2223f93cc766402841a8bf3e))
* **frontend:** update sheet options color mode ([8b727e8](https://github.com/TClark1011/bag-of-holding/commit/8b727e80f6d244e043d6708882b66c80f07681cc)), closes [#1](https://github.com/TClark1011/bag-of-holding/issues/1)
* **fullstack:** :label: updated some member delete code to use enums for member delete methods ([83649ce](https://github.com/TClark1011/bag-of-holding/commit/83649ce5e83db225163a878a628dfca5c134d90e))
* **scripts:** :bug: 'setupDevDb' script no longer hangs ([c17dad7](https://github.com/TClark1011/bag-of-holding/commit/c17dad7f50afd7dea257865567c64d2cdf725c3e))
* **scripts:** fix grammar in welcome dialog ([14ce3df](https://github.com/TClark1011/bag-of-holding/commit/14ce3dff17bdad6584cf6fbe274d8a53c724d8f0))
* **workspace:** :bug: (hopefully) fixed testing github action ([265b9b2](https://github.com/TClark1011/bag-of-holding/commit/265b9b2249a30565f3709303ec47a06a528e4d0d))
* **workspace:** :bug: added mock env variables to github test action ([3f979ef](https://github.com/TClark1011/bag-of-holding/commit/3f979ef5491cd17be0142aff4d0f7e32f718d5ea))
* **workspace:** :bug: github actions ([fe3b0ee](https://github.com/TClark1011/bag-of-holding/commit/fe3b0ee5dce2911e93987cb404a71492016cd524))
* **workspace:** :bug: github actions ;( ([2a66d80](https://github.com/TClark1011/bag-of-holding/commit/2a66d8003a8df31836951a3cdc56245ce41583ba))
* **workspace:** :bug: github actions ! ([1aaf8a7](https://github.com/TClark1011/bag-of-holding/commit/1aaf8a7d6d49d312e515d0b1f703be7a8de410dc))
* **workspace:** :bug: more github action stuff ([16dc38a](https://github.com/TClark1011/bag-of-holding/commit/16dc38a532131856cb5d41c468807bdecb8d50be))
* **workspace:** :bug: more github test action fixes ([d211306](https://github.com/TClark1011/bag-of-holding/commit/d21130604e02bc9df6976c0a40bc03ab6356721f))
* **workspace:** :bug: tripe jest timeout ([16f68e6](https://github.com/TClark1011/bag-of-holding/commit/16f68e6f89ead29ab49c5559994d4e985bfe4272))
* :bug: HOTFIX: added timestamps to sheet schema ([62d4769](https://github.com/TClark1011/bag-of-holding/commit/62d4769bfb85fceb3f4ba83c0623739b1649391a))
* **workspace:** :bug: moved assets folder inside src folder ([f61079b](https://github.com/TClark1011/bag-of-holding/commit/f61079be84d2a67348af77abd9bf1023c7b5a688))
* **workspace:** :heavy_plus_sign: added missing type definition package ([29ef250](https://github.com/TClark1011/bag-of-holding/commit/29ef2503c06c2ab1061f55724959606ef65ae649))
* **workspace:** :wrench: setup pre install hook to run husky ([6e3012f](https://github.com/TClark1011/bag-of-holding/commit/6e3012fcaa994f6d47491c155f811ba4c1c9b9e2))

### 1.0.3 (2021-04-23)


### Bug Fixes

* **workspace:** :bug: moved assets folder inside src folder ([f61079b](https://github.com/TClark1011/bag-of-holding/commit/f61079be84d2a67348af77abd9bf1023c7b5a688))
* **workspace:** :wrench: setup pre install hook to run husky ([6e3012f](https://github.com/TClark1011/bag-of-holding/commit/6e3012fcaa994f6d47491c155f811ba4c1c9b9e2))
