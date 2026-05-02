  Post-battle flow                                                                                                                     
                                                                                                                                       
  - Win: pick a random move from the monster's moveset → call learnMove() → call gainXp() → show which move was learned                
  - Loss: just reset the battle (spec says "nothing happens")
  - Neither gainXp nor learnMove is ever called                                                                                        
                                                                                                                                       
  Map / Run Overview screen (missing entirely)
                                                                                                                                       
  - New screen showing all 5 encounters in order — currently App.tsx only has "menu" | "battle"                                        
  - Click an encounter to enter battle for that specific monster (BattleScreen is hardcoded to monsters[0])
  - Display currently equipped moves on the map screen                                                                                 
  - Move management screen: swap moves in/out from the full learnedMoves pool (the context methods exist but there's no UI)            
                                                                                                                                       
  App flow / run progression                                                                                                           
                                                                                                                                       
  - Track which monster in the run the player is currently on                                                                          
  - Unlock next encounter only after beating the current one
  - Full-run win state after defeating monster 5 