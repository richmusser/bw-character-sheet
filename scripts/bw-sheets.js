class BWCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["bw-sheet", "sheet", "actor"],
            template: "modules/bw-character-sheet/templates/character-sheet.html",
            width: 800,
            height: 900,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
        });
    }

    getData() {
        const data = super.getData();
        data.actor = this.actor;
        data.system = this.actor.system;

        // Initialize stats if they don't exist
        if (!data.system.stats) {
            data.system.stats = {};
        }

        // Initialize each stat with default values if they don't exist
        const stats = ['will', 'power', 'agility', 'perception', 'forte', 'speed'];
        stats.forEach(stat => {
            if (!data.system.stats[stat]) {
                data.system.stats[stat] = {
                    shade: 'B',
                    exponent: 0,
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                };
            } else {
                // Ensure difficult and challenge arrays exist
                if (!data.system.stats[stat].difficult) {
                    data.system.stats[stat].difficult = [false, false, false, false];
                }
                if (!data.system.stats[stat].challenge) {
                    data.system.stats[stat].challenge = [false, false, false];
                }
            }
        });

        // Initialize attributes if they don't exist
        if (!data.system.attributes) {
            data.system.attributes = {
                health: 0,
                steel: 0,
                resources: 0,
                circles: 0
            };
        }

        // Initialize beliefs if they don't exist
        if (!data.system.beliefs) {
            data.system.beliefs = {};
        }
        // Ensure 4 beliefs exist
        for (let i = 0; i < 4; i++) {
            if (!data.system.beliefs[i]) {
                data.system.beliefs[i] = { text: "" };
            }
        }

        // Initialize instincts if they don't exist
        if (!data.system.instincts) {
            data.system.instincts = { text: "" };
        }

        // Initialize artha if it doesn't exist
        if (!data.system.artha) {
            data.system.artha = {
                fate: 0,
                persona: 0,
                deeds: 0
            };
        }

        // Initialize skills if they don't exist
        if (!data.system.skills) {
            data.system.skills = {};
        }
        // Ensure 40 skills exist (20 per column)
        for (let i = 0; i < 40; i++) {
            if (!data.system.skills[i]) {
                data.system.skills[i] = {
                    name: "",
                    shade: 'B',
                    exponent: 0,
                    difficult: [false, false, false, false],
                    challenge: [false, false, false],
                    routine: [false, false, false, false]
                };
            } else {
                // Ensure all arrays exist
                if (!data.system.skills[i].difficult) {
                    data.system.skills[i].difficult = [false, false, false, false];
                }
                if (!data.system.skills[i].challenge) {
                    data.system.skills[i].challenge = [false, false, false];
                }
                if (!data.system.skills[i].routine) {
                    data.system.skills[i].routine = [false, false, false, false];
                }
            }
        }

        // Ensure the data is properly structured
        if (!this.actor.system.stats) {
            this.actor.update({
                'system.stats': data.system.stats
            });
        }

        if (!this.actor.system.attributes) {
            this.actor.update({
                'system.attributes': data.system.attributes
            });
        }

        if (!this.actor.system.skills) {
            this.actor.update({
                'system.skills': data.system.skills
            });
        }

        // Log the current data for debugging
        console.log('Current stats data:', data.system.stats);
        console.log('Current attributes data:', data.system.attributes);
        console.log('Current skills data:', data.system.skills);

        return data;
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Handle all input changes
        html.find('input, select, textarea').on('change', this._onInputChange.bind(this));
    }

    async _onInputChange(event) {
        event.preventDefault();
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // Handle nested updates for stats
        if (name.startsWith('system.stats.')) {
            const parts = name.split('.');
            const stat = parts[2];
            const property = parts[3];
            const index = parts[4];
            
            // Get the current stats data
            const currentStats = this.actor.system.stats || {};
            const currentStat = currentStats[stat] || { shade: 'B', exponent: 0 };
            
            // Create the update object
            const updateData = {};
            updateData[`system.stats.${stat}.${property}.${index}`] = value;
            
            // Update the actor
            await this.actor.update(updateData);
            
            // Force a re-render of the sheet
            this.render(true);
        } else {
            // Handle regular updates
            await this.actor.update({
                [name]: value
            });
        }
    }
}

// Register the sheet
Actors.registerSheet("bw-sheets", BWCharacterSheet, {
    types: ["character"],
    makeDefault: true
});

// Initialize the module
Hooks.once('init', async function() {
    console.log('Burning Wheel Character Sheets | Initializing');
});

// When the module is ready
Hooks.once('ready', async function() {
    console.log('Burning Wheel Character Sheets | Ready');
}); 