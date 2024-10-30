import React from 'react';
import ButtonPrimary from '../../components/button-primary';
import monsters from '../../data/monsters.json';

function NewBuild() {
    const [isMonsters, setIsMonsters] = React.useState(true);
    const [selectedMonster, setSelectedMonster] = React.useState(null);

    return (
        <div>
            <h1 className='cinzel text-4xl text-center my-8'>
                New Build
            </h1>
            <div className='flex flex-row w-full wrap mb-4'>
                <div className='basis-1/2 bg-slate-500/10 m-4 p-4 rounded-md'>
                    {selectedMonster ? (
                        <div>
                            <img src={selectedMonster.icon} alt={selectedMonster.name} className='w-20 h-20 mx-auto' />
                            <p className='text-xl font-bold text-center'>{selectedMonster.name}</p>
                            <p>HP: {selectedMonster.baseStats.hp}</p>
                            <p>ATK: {selectedMonster.baseStats.atk}</p>
                            <p>DEF: {selectedMonster.baseStats.def}</p>
                            <p>ACC: {selectedMonster.baseStats.acc}</p>
                            <p>CDD: {selectedMonster.baseStats.cdd}</p>
                            <p>CR: {selectedMonster.baseStats.cr}</p>
                            <p>CD: {selectedMonster.baseStats.cd}</p>
                            <p>RES: {selectedMonster.baseStats.res}</p>
                            <p>PEN: {selectedMonster.baseStats.pen}</p>
                        </div>
                    ) : (
                        <div>Select a monster</div>
                    )}
                </div>
                <div className='basis-1/2 bg-slate-500/10 m-4 p-4 rounded-md'>
                    rune data goes here
                </div>
            </div>
            <div className='m-4 bg-slate-500/10 rounded-md p-4'>
                <div className='flex flex-row w-full justify-center items-center gap-2'>
                    <ButtonPrimary onClick={() => setIsMonsters(true)}>
                        Monsters
                    </ButtonPrimary>
                    <ButtonPrimary  onClick={() => setIsMonsters(false)}>
                        Runes
                    </ButtonPrimary>
                </div>
                <div className='w-full flex flex-wrap'>
                    {isMonsters ? (
                            monsters
                            .sort((a, b) => a.name.localeCompare(b.name))
                            .map((monster) => (
                                <div key={monster.id} className='m-2 p-2 flex flex-col items-center w-20 text-center cursor-pointer hover:bg-slate-500/20 rounded-md' onClick={() => setSelectedMonster(monsters.find((m) => m.id === monster.id))}>
                                    <img src={monster.icon} alt={monster.name} className='w-16 h-16' />
                                    <div>{monster.name}</div>
                                </div>
                            ))
                    ) : (
                        <div>Runes</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NewBuild;
