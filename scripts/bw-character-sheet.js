class BWCharacterSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["bw-sheet", "sheet", "actor"],
            template: "modules/bw-character-sheet/templates/bw-character-sheet.html",
            width: 1000,
            height: 900,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "summary" }]
        });
    }

    async getData() {
        const data = await super.getData();
        const actor = this.actor;

        // Ensure system object exists
        if (!actor.system) {
            await actor.update({ system: {} });
        }

        // Initialize learning if it doesn't exist
        if (!actor.system.learning) {
            await actor.update({
                "system.learning": {
                    skills: {},
                    notes: ""
                }
            });
        }

        // Ensure learning.skills exists
        if (!actor.system.learning.skills) {
            await actor.update({
                "system.learning.skills": {}
            });
        }

        // Ensure 10 learning skill slots exist
        for (let i = 0; i < 10; i++) {
            if (!actor.system.learning.skills[i]) {
                await actor.update({
                    [`system.learning.skills.${i}`]: {
                        name: "",
                        aptitude: 0,
                        tests: [false, false, false, false, false, false, false, false, false]
                    }
                });
            }
        }

        // Initialize Artha values if they don't exist
        if (!actor.system.artha) {
            await actor.update({
                "system.artha": {
                    fate: 0,
                    persona: 0,
                    deeds: 0
                }
            });
        }

        // Initialize attributes if they don't exist
        if (!actor.system.attributes) {
            await actor.update({
                "system.attributes": {
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
                        challenge: [false, false, false],
                        fate: 0,
                        persona: 0,
                        deeds: 0
                    },
                    custom2: {
                        name: "",
                        shade: "B",
                        exponent: 0,
                        routine: [false, false, false, false],
                        difficult: [false, false, false, false],
                        challenge: [false, false, false],
                        fate: 0,
                        persona: 0,
                        deeds: 0
                    }
                }
            });
        }

        // Initialize traits if they don't exist
        if (!actor.system.traits) {
            await actor.update({
                "system.traits": {
                    character: { text: "" },
                    die: { text: "" },
                    callOn: { text: "" }
                }
            });
        }

        // Initialize stats if they don't exist
        if (!actor.system.stats) {
            await actor.update({
                "system.stats": {}
            });
        }

        // Initialize each stat with default values if they don't exist
        const stats = ['will', 'power', 'agility', 'perception', 'forte', 'speed'];
        for (const stat of stats) {
            if (!actor.system.stats[stat]) {
                const defaultValues = {
                    shade: 'B',
                    exponent: 0,
                    difficult: [false, false, false, false],
                    challenge: [false, false, false]
                };

                // Add stride and mountedStride for speed stat
                if (stat === 'speed') {
                    defaultValues.stride = 0;
                    defaultValues.mountedStride = 0;
                }

                await actor.update({
                    [`system.stats.${stat}`]: defaultValues
                });
            }
        }

        // Initialize custom stats if they don't exist
        const customStats = ['custom1', 'custom2'];
        for (const stat of customStats) {
            if (!actor.system.stats[stat]) {
                await actor.update({
                    [`system.stats.${stat}`]: {
                        name: "",
                        shade: 'B',
                        exponent: 0,
                        difficult: [false, false, false, false],
                        challenge: [false, false, false]
                    }
                });
            }
        }

        // Initialize beliefs if they don't exist
        if (!actor.system.beliefs) {
            await actor.update({
                "system.beliefs": {}
            });
        }
        // Ensure 4 beliefs exist
        for (let i = 0; i < 4; i++) {
            if (!actor.system.beliefs[i]) {
                await actor.update({
                    [`system.beliefs.${i}`]: { text: "" }
                });
            }
        }

        // Initialize instincts if they don't exist
        if (!actor.system.instincts) {
            await actor.update({
                "system.instincts": { text: "" }
            });
        }

        // Initialize skills if they don't exist
        if (!actor.system.skills) {
            await actor.update({
                "system.skills": {}
            });
        }
        // Ensure 40 skills exist (20 per column)
        for (let i = 0; i < 40; i++) {
            if (!actor.system.skills[i]) {
                await actor.update({
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
                pgtsData.injury[i] = [false, false, false];
            }
            
            await actor.update({
                "system.pgts": pgtsData
            });
        }

        // Initialize spells if they don't exist
        if (!actor.system.spells) {
            await actor.update({
                "system.spells": {}
            });
        }
        // Ensure 20 spells exist
        for (let i = 0; i < 20; i++) {
            if (!actor.system.spells[i]) {
                await actor.update({
                    [`system.spells.${i}`]: {
                        name: "",
                        effect: "",
                        ob: 0,
                        woven: false,
                        incantation: false,
                        timesCast: 0
                    }
                });
            }
        }

        // Ensure gear object exists
        if (!actor.system.gear) {
            await actor.update({
                "system.gear": {
                    weapons: {},
                    rangedWeapons: {},
                    armor: {
                        head: { dice: [false, false, false, false, false, false], type: "" },
                        torso: { dice: [false, false, false, false, false, false, false], type: "" },
                        rightArm: { dice: [false, false, false, false, false, false], type: "" },
                        leftArm: { dice: [false, false, false, false, false, false], type: "" },
                        rightLeg: { dice: [false, false, false, false, false, false], type: "" },
                        leftLeg: { dice: [false, false, false, false, false, false], type: "" },
                        shield: { dice: [false, false, false, false, false], type: "" },
                        clumsyWeight: {
                            stealthy: "",
                            clumsy: ""
                        }
                    }
                }
            });
        }

        // Initialize weapons if they don't exist
        if (!actor.system.gear.weapons) {
            await actor.update({
                "system.gear.weapons": {}
            });
        }

        // Ensure 5 melee weapons exist
        for (let i = 0; i < 5; i++) {
            if (!actor.system.gear.weapons[i]) {
                const defaultWeapon = i === 0 ? {
                    name: "Fist",
                    add: 2,
                    va: 0,
                    ws: 3,
                    length: "Shortest",
                    pow: 0,
                    shade: "B"
                } : {
                    name: "",
                    add: 0,
                    va: 0,
                    ws: 0,
                    length: "",
                    pow: 0,
                    shade: "B"
                };
                
                await actor.update({
                    [`system.gear.weapons.${i}`]: defaultWeapon
                });
            }
        }

        // Initialize ranged weapons if they don't exist
        if (!actor.system.gear.rangedWeapons) {
            await actor.update({
                "system.gear.rangedWeapons": {}
            });
        }

        // Ensure 3 ranged weapons exist
        for (let i = 0; i < 3; i++) {
            if (!actor.system.gear.rangedWeapons[i]) {
                await actor.update({
                    [`system.gear.rangedWeapons.${i}`]: {
                        name: "",
                        va: 0,
                        dofI: 1,
                        dofM: 1,
                        dofS: 1,
                        optimalRange: "",
                        extremeRange: "",
                        shade: "B"
                    }
                });
            }
        }

        // Ensure we have valid data objects before merging
        const systemData = actor.system || {};

        systemData.summaryData = this.getSummaryData(actor.system);

        return foundry.utils.mergeObject(data, {
            system: systemData,
            editable: this.isEditable,
            config: CONFIG.BW
        });
    }

    getSummaryData(system) {

        console.log("System", system);

        //additional data for summary tab

        let summaryData = {
            pgts:{su:0, li:0, mi:0, se:0, tr:0, mo:0},

            traits: {
                character: "",
                die: "",    
                callOn: ""
            },
          
            skills: [],
            armor: [],
            weapons: []

        }

        if(system?.pgts?.tolerance) {
            //swap keys and values
            Object.keys(system.pgts.tolerance).forEach(key => {
                const value = system.pgts.tolerance[key];
                if(value) {
                    summaryData.pgts[value.toLowerCase()] = key;
                }
            })
        }

        if(system?.traits?.character) {
            summaryData.traits.character = system.traits.character.text || "";
        }

        if(system?.traits?.die) {
            summaryData.traits.die = system.traits.die.text || "";
        }

        if(system?.traits?.callOn) {
            summaryData.traits.callOn = system.traits.callOn.text || "";
        }

        if(system?.skills) {
            // Convert skills object to array
            let skills = []
             Object.values(system.skills).forEach(skill => {

                if(skill.name.trim()) {
                    let s = {
                        name: skill.name || "",
                        shade: skill.shade || "B",
                        exponent: skill.exponent || 0
                    };
                    skills.push(s);
                }
            });

            summaryData.skills = skills;
        }

        if(system?.gear?.armor) {
            // Convert armor object to array
            let armor = [];
            const armorTypes = ['head', 'torso', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg', 'shield'];
            armorTypes.forEach(type => {
                if(system.gear.armor[type] && system.gear.armor[type].type) {

                    let diceArray = system.gear.armor[type].dice || {};
                    let diceCount = 0;
                    Object.values(diceArray).forEach(value => {
                        if(value) {
                            diceCount++;
                        }
                    })

                    let a = {
                        type: `${type}`,
                        name: `${this.pascalToText(type)}`,
                        dice: diceCount
                    };
                    armor.push(a);
                }
            });

            summaryData.armor = armor;
        }

        if(system?.gear?.weapons) {
            // Convert weapons object to array
            let weapons = [];
            Object.values(system.gear.weapons).forEach(weapon => {
                if(weapon.name.trim()) {

                    let baseDmg = weapon.pow + system.stats.power.exponent;

                    let w = {
                        name: weapon.name || "",
                        add: weapon.add || 0,
                        va: weapon.va || 0,
                        ws: weapon.ws || 0,
                        length: weapon.length || "",
                        pow: weapon.pow || 0,
                        shade: weapon.shade || "B",
                        i: Math.ceil(baseDmg/2),
                        m: baseDmg,
                        s: Math.floor(baseDmg * 1.5)
                    };
                    weapons.push(w);
                }
            });

              Object.values(system.gear.rangedWeapons).forEach(weapon => {
                if(weapon.name.trim()) {

                    let baseDmg = weapon.pow + system.stats.power.exponent;

                    let w = {
                        name: weapon.name || "",
                        add: '1/2',
                        va: weapon.va || 0,
                        ws: '',
                        length:`${weapon.optimalRange} / ${weapon.extremeRange}`,
                        pow: weapon.pow || 0,
                        shade: weapon.shade || "B",
                        i: weapon.dofI || 1,
                        m: weapon.dofM || 1,        
                        s: weapon.dofS || 1
                    };
                    weapons.push(w);
                }
            });

            summaryData.weapons = weapons;


        }

        console.log("******* Summary Data **********", summaryData);

        return summaryData;

    }

    pascalToText(name) {
        // Convert the name to a more readable format
        let capitalized =  name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ');

        return capitalized.replace(/([a-z0-9])([A-Z])/g, '$1 $2') // Split camelCase or PascalCase
            .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2').trim() // Handle acronyms       
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
    types: ["character", "npc"],
    makeDefault: true
});

// Initialize the module
Hooks.once('init', async function() {
    console.log('Burning Wheel Character Sheets | Initializing');
    
    // Register Handlebars helpers
    Handlebars.registerHelper('subtract', function(a, b) {
        return a - b;
    });

    Handlebars.registerHelper('add', function(a, b) {
        const numA = Number(a) || 0;
        const numB = Number(b) || 0;
        return numA + numB;
    });

    Handlebars.registerHelper('divide', function(a, b) {
        const numA = Number(a) || 0;
        const numB = Number(b) || 1;
        return numA / numB;
    });

    Handlebars.registerHelper('multiply', function(a, b) {
        const numA = Number(a) || 0;
        const numB = Number(b) || 0;
        return numA * numB;
    });

    Handlebars.registerHelper('ceil', function(a) {
        return Math.ceil(Number(a) || 0);
    });

    Handlebars.registerHelper('floor', function(a) {
        return Math.floor(Number(a) || 0);
    });

    Handlebars.registerHelper('calculateMortalWounds', function(power, forte) {
        return Math.floor((power + forte) / 2) + 6;
    });

    Handlebars.registerHelper('calculateReflexes', function(perception, agility, speed) {
        return Math.floor((perception + agility + speed) / 3);
    });

    // Register Handlebars partials from array of file paths
    const partialPaths = [
        'modules/bw-character-sheet/templates/partials/header.html',
        'modules/bw-character-sheet/templates/partials/main-tab.html',
        'modules/bw-character-sheet/templates/partials/stats-attributes-tab.html',
        'modules/bw-character-sheet/templates/partials/skills-tab.html',
        'modules/bw-character-sheet/templates/partials/relationships-tab.html',
        'modules/bw-character-sheet/templates/partials/pgts-tab.html',
        'modules/bw-character-sheet/templates/partials/gear-tab.html',
        'modules/bw-character-sheet/templates/partials/spells-tab.html',
        'modules/bw-character-sheet/templates/partials/notes-tab.html',
        'modules/bw-character-sheet/templates/partials/learning-tab.html',
        'modules/bw-character-sheet/templates/partials/summary-tab.html'
        
        // Add more partial paths here as tabs are moved to separate files
    ];

    for (const partialPath of partialPaths) {
        try {
            const partialTemplate = await fetch(partialPath).then(r => r.text());
            Handlebars.registerPartial(partialPath, partialTemplate);
            console.log(`Registered partial: ${partialPath}`);
        } catch (error) {
            console.error(`Failed to register partial ${partialPath}:`, error);
        }
    }
});

// When the module is ready
Hooks.once('ready', async function() {
    console.log('Burning Wheel Character Sheets | Ready');
}); 