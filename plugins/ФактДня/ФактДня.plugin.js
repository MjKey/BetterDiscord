/**
 * @name Факт_Дня
 * @author MjKey (RU), Nyx - Origingal version (EN)
 * @version 1.0.0
 * @license MIT
 * @description Бесполензный факт каждый день! Когда заходите в Дискорд.
 * @website https://github.com/MjKey
 * @source https://raw.githubusercontent.com/MjKey/BetterDiscord/main/plugins/ФактДня/ФактДня.plugin.js
 * @updateUrl https://raw.githubusercontent.com/MjKey/BetterDiscord/main/plugins/ФактДня/ФактДня.plugin.js
 */

const request = require("request");
module.exports = (() => {
    const config = {
        info: {
            name: "Факт дня",
            authors: [
                {
                    name: "Nyx",
                    discord_id: "27048136006729728"
                },
                {
                    name: "MjKey",
                    discord_id: "305324858890256397"
                }
            ],
            version: "1.0.0",
            description: "Бесполензный факт каждый день, когда заходите в Дискорд!"
        },
        github: "https://github.com/MjKey/BetterDiscord/blob/main/plugins/ФактДня/ФактДня.plugin.js",
        github_raw:"https://raw.githubusercontent.com/MjKey/BetterDiscord/main/plugins/ФактДня/ФактДня.plugin.js",
        main: "index.js",
    };
    return !global.ZeresPluginLibrary ? class {
            constructor() {
                this._config = config;
            }
            getName() {
                return config.info.name;
            }
            getAuthor() {
                return config.info.authors.map((a) => a.name).join(", ");
            }
            getDescription() {
                return config.info.description;
            }
            getVersion() {
                return config.info.version;
            }
            load() {
                BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.info.name} is missing. Please click Download Now to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onConfirm: () => {
                        request.get("https://rauenzi.github.io/BDPluginLibrary/release/0PluginLibrary.plugin.js", async (error, response, body) => {
                            if (error) return require("electron").shell.openExternal("https://betterdiscord.net/ghdl?url=https://raw.githubusercontent.com/rauenzi/BDPluginLibrary/master/release/0PluginLibrary.plugin.js");
                            await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                        });
                    }
                });
            }
            start() {}
            stop() {}
        }
        : (([Plugin, Library]) => {
            const plugin = (Plugin, Library) => {
                const { Patcher, Modals } = Library;

                return class ReplaceTimestamps extends Plugin {

                    onStart() {
                        request.get("https://uselessfacts.jsph.pl/today.json?language=en", (error, response, body) => {
                            request.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&hl=ru&dt=t&dt=bd&dj=1&source=icon&tk=467103.467103&q=${JSON.parse(body).text}`, (error, response, body) => {
                                Modals.showConfirmationModal(
                                    "Факт дня",
                                    JSON.parse(body)['sentences'][0].trans,
                                    {
                                        confirmText: "Круто!",
                                        cancelText: "Хре"
                                    }
                                );
                            });
                        });
                    }

                    onStop() {
                        Patcher.unpatchAll();
                    }
                };
            };
            return plugin(Plugin, Library);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
