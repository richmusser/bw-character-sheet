class BWCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["bw-sheet", "sheet", "actor"],
            template: "modules/bw-character-sheet/templates/bw-character-sheet.html",
            width: 1000,
            height: 900,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "main" }]
        });
    }

    async getData() {
        const data = super.getData();
        const actor = this.actor;

        // Initialize Artha values if they don't exist
        if (!actor.system.artha) {
            actor.update({
                "system.artha": {
                    fate: 0,
                    persona: 0,
                    deeds: 0
                }
            });
        }

        // Initialize attributes if they don't exist
        if (!actor.system.attributes) {
            actor.system.attributes = {
                health: {
                    shade: "B",
                    exponent: 5,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                },
                steel: {
                    shade: "B",
                    exponent: 5,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                },
                reflexes: {
                    shade: "B",
                    exponent: 0
                },
                mortalWounds: {
                    shade: "B",
                    exponent: 0
                },
                circles: {
                    shade: "B",
                    exponent: 0,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                },
                resources: {
                    shade: "B",
                    exponent: 0,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false],
                    tax: 0,
                    cash: "",
                    funds: "",
                    loans: ""
                },
                reputations: {
                    text: ""
                },
                custom1: {
                    name: "",
                    shade: "B",
                    exponent: 0,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                },
                custom2: {
                    name: "",
                    shade: "B",
                    exponent: 0,
                    routine: [false, false, false, false],
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                }
            };
        }

        // Initialize traits if they don't exist
        if (!actor.system.traits) {
            actor.update({
                "system.traits": {
                    character: { text: "" },
                    die: { text: "" },
                    callOn: { text: "" }
                }
            });
        }

        // Initialize stats if they don't exist
        if (!actor.system.stats) {
            actor.update({
                "system.stats": {}
            });
        }

        // Initialize each stat with default values if they don't exist
        const stats = ['will', 'power', 'agility', 'perception', 'forte', 'speed'];
        stats.forEach(stat => {
            if (!actor.system.stats[stat]) {
                actor.update({
                    [`system.stats.${stat}`]: {
                        shade: 'B',
                        exponent: 0,
                        difficult: [false, false, false, false],
                        challenge: [false, false, false]
                    }
                });
            }
        });

        // Initialize beliefs if they don't exist
        if (!actor.system.beliefs) {
            actor.update({
                "system.beliefs": {}
            });
        }
        // Ensure 4 beliefs exist
        for (let i = 0; i < 4; i++) {
            if (!actor.system.beliefs[i]) {
                actor.update({
                    [`system.beliefs.${i}`]: { text: "" }
                });
            }
        }

        // Initialize instincts if they don't exist
        if (!actor.system.instincts) {
            actor.update({
                "system.instincts": { text: "" }
            });
        }

        // Initialize skills if they don't exist
        if (!actor.system.skills) {
            actor.update({
                "system.skills": {}
            });
        }
        // Ensure 40 skills exist (20 per column)
        for (let i = 0; i < 40; i++) {
            if (!actor.system.skills[i]) {
                actor.update({
                    [`system.skills.${i}`]: {
                        name: "",
                        shade: 'B',
                        exponent: 0,
                        difficult: [false, false, false, false],
                        challenge: [false, false, false],
                        routine: [false, false, false, false]
                    }
                });
            }
        }

        // Initialize PGTS if it doesn't exist
        if (!actor.system.pgts) {
            const pgtsData = {
                tolerance: {},
                coordinate: {},
                injury: {},
                obstaclePenalties: 0,
                woundedDice: 0
            };
            
            // Initialize each type with 16 empty fields
            for (let i = 1; i <= 16; i++) {
                pgtsData.tolerance[i] = "";
                pgtsData.coordinate[i] = "";
                pgtsData.injury[i] = "";
            }
            
            await actor.update({
                "system.pgts": pgtsData
            });
        }

        // Ensure we have valid data objects before merging
        const actorData = {
            actor: this.actor,
            system: this.actor.system || {}
        };

        // Ensure both data and actorData are objects
        const baseData = typeof data === 'object' ? data : {};
        const mergedData = foundry.utils.mergeObject(baseData, actorData);

        // Return the merged data
        return mergedData;
    }

    async _onResetInjuries(event) {
        event.preventDefault();
        
        // Create an object to hold all PGTS injury updates
        const updates = {
            'system.pgts.obstaclePenalties': 0,
            'system.pgts.woundedDice': 0
        };

        // Reset all PGTS injury checkboxes (16 body locations, 3 checkboxes each)
        for (let i = 1; i <= 16; i++) {
            for (let j = 0; j < 3; j++) {
                updates[`system.pgts.injury.${i}.${j}`] = false;
            }
        }
        
        await this.actor.update(updates);
    }

    activateListeners(html) {
        super.activateListeners(html);

        // Handle all input changes
        html.find('input, select, textarea').on('change', this._onInputChange.bind(this));
        // Reset injuries button
        html.find('.reset-injuries').click(this._onResetInjuries.bind(this));
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
    
    // Register Handlebars helpers
    Handlebars.registerHelper('subtract', function(a, b) {
        return a - b;
    });

    Handlebars.registerHelper('calculateMortalWounds', function(power, forte) {
        return Math.floor((power + forte) / 2) + 6;
    });

    Handlebars.registerHelper('calculateReflexes', function(perception, agility, speed) {
        return Math.floor((perception + agility + speed) / 3);
    });
});

// When the module is ready
Hooks.once('ready', async function() {
    console.log('Burning Wheel Character Sheets | Ready');
}); 