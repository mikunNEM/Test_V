const dom_version = document.getElementById('version');
dom_version.innerHTML = `v1.0.11　|　Powered by SYMBOL`;

const sym = require('/node_modules/symbol-sdk');
const op  = require("/node_modules/rxjs/operators");
const rxjs = require("/node_modules/rxjs");

//MAIN_NET の場合

const EPOCH_M = 1615853185;
const NODE_URL_M = 'https://symbol-mikun.net:3001';
const NET_TYPE_M = sym.NetworkType.MAIN_NET;
const XYM_ID_M = '6BED913FA20223F8';
const GENERATION_HASH_M = '57F7DA205008026C776CB6AED843393F04CD458E0AA2D9F1D5F31A402072B2D6';

const repo_M = new sym.RepositoryFactoryHttp(NODE_URL_M);      // RepositoryFactoryはSymbol-SDKで提供されるアカウントやモザイク等の機能を提供するRepositoryを作成するためのもの
const accountRepo_M = repo_M.createAccountRepository();
const txRepo_M = repo_M.createTransactionRepository();
const mosaicRepo_M = repo_M.createMosaicRepository();
const nsRepo_M = repo_M.createNamespaceRepository();
const nwRepo_M = repo_M.createNetworkRepository();
const chainRepo_M = repo_M.createChainRepository();
const blockRepo1_M = repo_M.createBlockRepository();
const metaRepo_M = repo_M.createMetadataRepository();
const metaService_M = new sym.MetadataTransactionService(metaRepo_M);
const EXPLORER_M = "https://symbol.fyi";

//TEST_NET の場合

const EPOCH_T = 1667250467;
//const EPOCH_T = 1672735883;  //Canade
const NODE_URL_T = 'https://mikun-testnet.tk:3001';
const NET_TYPE_T = sym.NetworkType.TEST_NET;
const XYM_ID_T = '72C0212E67A08BCE';
//const XYM_ID_T = '5282230404218E56';  //Canade CBDP
const GENERATION_HASH_T = '49D6E1CE276A85B70EAFE52349AACCA389302E7A9754BCF1221E79494FC665A4';
//const GENERATION_HASH_T = 'AA443BA0A8AC1300743B44215D4436694013E52518B95EB05B3DCF4D66C4319B'; // Canade

const repo_T = new sym.RepositoryFactoryHttp(NODE_URL_T);       // RepositoryFactoryはSymbol-SDKで提供されるアカウントやモザイク等の機能を提供するRepositoryを作成するためのもの
const accountRepo_T = repo_T.createAccountRepository();
const txRepo_T = repo_T.createTransactionRepository();
const mosaicRepo_T = repo_T.createMosaicRepository();
const nsRepo_T = repo_T.createNamespaceRepository();
const nwRepo_T = repo_T.createNetworkRepository();
const chainRepo_T = repo_T.createChainRepository();
const blockRepo1_T = repo_T.createBlockRepository();
const metaRepo_T = repo_T.createMetadataRepository();
const metaService_T = new sym.MetadataTransactionService(metaRepo_T);
const EXPLORER_T = "https://testnet.symbol.fyi";

let epochAdjustment;
let generationHash;
let NODE;
let networkType;
let XYM_ID;     
let repo;
let accountRepo;
let txRepo;
let mosaicRepo;
let nsRepo;
let nwRepo;
let chainRepo;
let blockRepo1;
let EXPLORER;
let grace_block;
let metaRepo;
let metaService;

setTimeout(() => {  //////////////////  指定した時間後に実行する  ////////////////////////////////////////////////
  
    console.log("SSS_Link=",window.isAllowedSSS());
    window.requestSSS();    // SSSと連携されてない場合、右下にメッセージが出る
  
const address = sym.Address.createFromRawAddress(window.SSS.activeAddress);
  
  console.log("activeAddress=",address.address);
  
const check_netType = address.address.charAt(0);     // 1文字目を抽出

   if (check_netType === 'N'){           //ネットワークの判別　 メインネット 
       epochAdjustment = EPOCH_M;
       NODE = NODE_URL_M;
       networkType = NET_TYPE_M;
       generationHash = GENERATION_HASH_M;
       XYM_ID = XYM_ID_M;
     
       repo = repo_M;
       accountRepo = accountRepo_M;
       txRepo = txRepo_M;
       mosaicRepo = mosaicRepo_M;
       nsRepo = nsRepo_M;
       nwRepo = nwRepo_M;
       chainRepo = chainRepo_M;
       blockRepo1 = blockRepo1_M;
       EXPLORER = EXPLORER_M;
       grace_block = 86400;
       metaRepo = metaRepo_M;
       metaService = metaService_M;

      console.log("MAIN_NET");
   }else 
      if (check_netType === 'T'){      // テストネット
          epochAdjustment = EPOCH_T;
          NODE = NODE_URL_T;
          networkType = NET_TYPE_T;
          generationHash = GENERATION_HASH_T;
          XYM_ID = XYM_ID_T;
        
          repo = repo_T;
          accountRepo = accountRepo_T;
          txRepo = txRepo_T;
          mosaicRepo = mosaicRepo_T;
          nsRepo = nsRepo_T;
          nwRepo = nwRepo_T;
          chainRepo = chainRepo_T;
          blockRepo1 = blockRepo1_T;
          EXPLORER = EXPLORER_T;
          grace_block = 2880;
          metaRepo = metaRepo_T;
          metaService = metaService_T;
        
          console.log("TEST_NET");
      }
       console.log("check_netType=",check_netType);
     

const dom_netType = document.getElementById('netType');  // network Type を表示　
     
  if (networkType === NET_TYPE_M){   
     dom_netType.innerHTML = `<font color="#ff00ff">< MAIN_NET ></font>`
  }else
     if (networkType === NET_TYPE_T){
        dom_netType.innerHTML = `<font color="ff8c00">< TEST_NET ></font>`
  }    
     
const dom_addr = document.getElementById('wallet-addr');
//dom_addr.innerText = address.pretty();                         // address.pretty() アドレスがハイフンで区切られた文字列で表示される
dom_addr.innerHTML = `<div class="copy_container"> ${address.address}<input type="image" src="src/copy.png" class="copy_bt" height="30px" id="${address.address}" onclick="Onclick_Copy(this.id);" /></div>`;          // ハイフン無しでアドレスを表示 　& 　コピーボタンを設置

console.log("address= wallet-addr",address);//////////////////////////////////////////////////////////////////////////////////////////////////  
     
const dom_explorer = document.getElementById('explorer');  // Wallet 右上のExplorerリンク
    
      dom_explorer.innerHTML = `<a href="${EXPLORER}/accounts/${address.address}" target="_blank" rel="noopener noreferrer">/ Explorer </a>`; 

     
      
	
///////////////////////////////////////////////    アカウント情報を取得する     ////////////////////////////////////////////

accountRepo.getAccountInfo(address)
  .toPromise()
  .then((accountInfo) => {
        console.log("accountInfo=",accountInfo)     
        console.log("account_Mosaics =",accountInfo.mosaics.length);

     ////

         //ブロック
          chainRepo.getChainInfo().subscribe(chain=>{  //////////   

            rxjs.zip(
              blockRepo1.getBlockByHeight(chain.height),
              blockRepo1.getBlockByHeight(chain.latestFinalizedBlock.height),
            ).subscribe(zip => {

              $("#chain_height").html(    //  最新ブロック
                "[ <a target='_blank' href='" + EXPLORER + "/blocks/" + zip[0].height.compact() + "'>" + zip[0].height.compact() + "</a> ]　日時: " + dispTimeStamp(Number(zip[0].timestamp.toString()),epochAdjustment)
              );
              $("#finalized_chain_height").html(   //  確定ブロック
                "[ <a target='_blank' href='" + EXPLORER + "/blocks/" + zip[1].height.compact() + "'>" + zip[1].height.compact() + "</a> ]　日時: " + dispTimeStamp(Number(zip[1].timestamp.toString()),epochAdjustment)
              );
              console.log("ブロック高=",zip[0].height.compact());
              console.log("ファイナライズブロック=",zip[1].height.compact());


             /////////////   モザイク　テーブル////////////////////////////////////////////////

              mosaicRepo.search({ownerAddress:accountInfo.address,
                                 pageSize: 100})
              .subscribe(async mosaic=>{
              
                console.log("mosaic_data=",mosaic.data);

                console.log("モザイクの数",mosaic.data.length);

                   const select_revoke = []; //　セレクトボックス初期化 (モザイク回収)
                   const select_mosaicID = [];//　セレクトボックス初期化 (モザイクID)
                   var body = document.getElementById("ms_table");

                   // <table> 要素と <tbody> 要素を作成　/////////////////////////////////////////////////////
                   var tbl = document.createElement("table");
                   var tblBody = document.createElement("tbody");
                   let mosaicNames;
                   // すべてのセルを作成
                   for (var i = -1; i < mosaic.data.length; i++) {  // ネームスペースの数だけ繰り返す
                        if (i > -1){
                            mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(mosaic.data[i].id.id.toHex())]).toPromise(); // モザイクIDからNamespaceの情報を取得する
                        }
                     // 表の行を作成
                     var row = document.createElement("tr");

                     for (var j = 0; j < 11; j++) {
                       // <td> 要素とテキストノードを作成し、テキストノードを
                       // <td> の内容として、その <td> を表の行の末尾に追加
                       var cell = document.createElement("td");                                                   
                          switch(j){
                            case 0:   //モザイクID
                              if (i === -1){
                                  var cellText = document.createTextNode("モザイクID");
                                  select_mosaicID.push({value:"--- Select ---",name:"--- Select ---"}); //セレクトボックス用の連想配列を作る
                              break;
                              }                             
                                 var cellText = document.createTextNode(mosaic.data[i].id.id.toHex());
                                 if(mosaic.data[i].duration.compact() === 0){ // ステータスが無効なモザイクを排除                               
                                   select_mosaicID.push({value:mosaic.data[i].id.id.toHex(),name:mosaic.data[i].id.id.toHex()}); //セレクトボックス用の連想配列を作る                                   
                                }else
                                   if (endHeight - zip[0].height.compact() > 0){ // ステータスが無効なモザイクを排除
                                      select_mosaicID.push({value:mosaic.data[i].id.id.toHex(),name:mosaic.data[i].id.id.toHex()}); //セレクトボックス用の連想配列を作る
                                   }
                              break;                
                            case 1:   //ネームスペース名
                              if (i === -1){
                                  var cellText = document.createTextNode("ネームスペース名");
                              break;
                              } 
                              if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合                       
                                  var cellText = document.createTextNode([mosaicNames][0][0].names[0].name);
                              }else{   // ネームスペースが無い場合
                                    var cellText = document.createTextNode("N/A"); 
                              }
                              break;       
                            case 2:   // 供給量
                              if (i === -1){
                                  var cellText = document.createTextNode("供給量");
                              break;
                              }
                             var supply1 = mosaic.data[i].supply.compact()/(10 ** mosaic.data[i].divisibility);
                                 supply1 = supply1.toLocaleString();

                              var cellText = document.createTextNode(supply1); 
                              break; 
                            case 3:   //残高
                              if (i === -1){
                                  var cellText = document.createTextNode("残高");
                                  break;
                              }                             
                              for (var k = 0; k < accountInfo.mosaics.length; k++){ 
                                if (accountInfo.mosaics[k].id.id.toHex() === mosaic.data[i].id.id.toHex()){ // accountInfoのamount データを探す
                                   var balance = accountInfo.mosaics[k].amount.compact();
                                }
                              }
                              balance = balance/(10 ** mosaic.data[i].divisibility);   // 可分性を考慮
                              balance = balance.toLocaleString();

                              var cellText = document.createTextNode(balance);
                              break;
                            case 4:   //有効期限
                              if (i === -1){
                                  var cellText = document.createTextNode("有効期限");
                                  break;
                              }
                              if (mosaic.data[i].duration.compact() === 0){
                                  var cellText = document.createTextNode("---　無期限　---");
                              }else{
                                   var endHeight = mosaic.data[i].startHeight.compact() + mosaic.data[i].duration.compact()   
                                   var remainHeight = endHeight - zip[0].height.compact();    
                                        t = dispTimeStamp(zip[0].timestamp.compact() + (remainHeight * 30000),epochAdjustment)                  
                                   var cellText = document.createTextNode(t);
                              }
                              break;
                            case 5:   // ステータス
                              if (i === -1){
                                  var cellText = document.createTextNode("ステータス");
                                  break;
                              }
                              if (mosaic.data[i].duration.compact() === 0){
                                  var cellText = document.createTextNode("　　🟢");
                              }else
                                 if (mosaic.data[i].duration.compact() > 0){
                                     var endHeight = mosaic.data[i].startHeight.compact() + mosaic.data[i].duration.compact()
                                     if (endHeight - zip[0].height.compact() > 0){
                                       var cellText = document.createTextNode("　　🟢");
                                     }else{
                                      var cellText = document.createTextNode("　　❌");
                                     }
                                 }
                              break;
                            case 6:   // 可分性
                              if (i === -1){
                                  var cellText = document.createTextNode("可分性");
                                  break;
                              }
                                  var cellText = document.createTextNode(`　${mosaic.data[i].divisibility}`);
                              break;
                            case 7:   //　制限可
                              if (i === -1){
                                  var cellText = document.createTextNode("制限可");
                                  break;
                              }
                              if (mosaic.data[i].flags.restrictable === true){
                                  var cellText = document.createTextNode("　🟢");
                              }else
                                 if (mosaic.data[i].flags.restrictable === false){
                                     var cellText = document.createTextNode("　❌");
                                 }                           
                              break;                                  
                            case 8:  // 供給量可変
                              if (i === -1){
                                  var cellText = document.createTextNode("供給量可変");
                                  break;
                              }
                              if (mosaic.data[i].flags.supplyMutable === true){
                                  var cellText = document.createTextNode("　　🟢");
                              }else
                                 if (mosaic.data[i].flags.supplyMutable === false){
                                     var cellText = document.createTextNode("　　❌");
                                 }                              
                              break;      
                            case 9:   // 転送可
                              if (i === -1){
                                  var cellText = document.createTextNode("転送可");                                  
                                  break;
                              }
                              if (mosaic.data[i].flags.transferable === true){
                                  var cellText = document.createTextNode("　🟢");
                              }else
                                 if (mosaic.data[i].flags.transferable === false){
                                     var cellText = document.createTextNode("　❌");
                                 }                                                    
                              break;      
                            case 10:   // 回収可
                              if (i === -1){
                                  var cellText = document.createTextNode("回収可");
                                  break;
                              }
                              if (mosaic.data[i].flags.revokable === true){
                                  var cellText = document.createTextNode("　🟢");
                                  if(mosaic.data[i].duration.compact() === 0){ // ステータスが無効なモザイクを排除
                                    select_revoke.push({value:mosaic.data[i].id.id.toHex(),name:mosaic.data[i].id.id.toHex()}); //セレクトボックス用の連想配列を作る
                                  }else
                                     if (endHeight - zip[0].height.compact() > 0){ // ステータスが無効なモザイクを排除
                                        select_revoke.push({value:mosaic.data[i].id.id.toHex(),name:mosaic.data[i].id.id.toHex()}); //セレクトボックス用の連想配列を作る
                                     }
                              }else
                                 if (mosaic.data[i].flags.revokable === false){
                                     var cellText = document.createTextNode("　❌");
                                 }                           
                              break;      
                            case 11:   // 編集
                              /////////////////////////////  保留  //////////
                              if (i === -1){
                                  var cellText = document.createTextNode("");
                                  break;
                              }
                              if (mosaic.data[i].duration.compact() === 0){
                                  var cellText = document.createTextNode("");
                              }else
                                 if (mosaic.data[i].duration.compact() > 0){
                                     var endHeight = mosaic.data[i].startHeight.compact() + mosaic.data[i].duration.compact()
                                     if (endHeight - zip[0].height.compact() > 0){
                                         var cellText = document.createTextNode("");
                                     }else{
                                          var cellText = document.createTextNode("");
                                     }
                              }
                              break;    
                            }      
                       cell.appendChild(cellText);
                       row.appendChild(cell);
                     }
                       
                     // 表の本体の末尾に行を追加
                     tblBody.appendChild(row);
                   }
                 
                   // <tbody> を <table> の中に追加
                   tbl.appendChild(tblBody);
                   // <table> を <body> の中に追加
                   body.appendChild(tbl);
                   // tbl の border 属性を 2 に設定
                   tbl.setAttribute("border", "1"); 
                   console.log("select_revoke=",select_revoke);
                   console.log("%cselect_mosaicID=","color: red",select_mosaicID);
                   

                   const jsSelectBox_rev = document.querySelector('.revoke_select');
                   const select = document.createElement('select');

                   select.classList.add('select_r');
                   select_revoke.forEach((v) => {
                     const option = document.createElement('option');
                     option.value = v.value;
                     option.textContent = v.name;
                     select.appendChild(option);
                   });
                   jsSelectBox_rev.appendChild(select);

                   ////    select_mosaicID  (Metadata用)    ///////////////////////////////////////

                   const jsSelectBox_mosaicID = document.querySelector('.select_mosaicID');
                   const select_mo = document.createElement('select');

                   select_mo.classList.add('select_mo');
                   select_mosaicID.forEach((v) => {
                     const option = document.createElement('option');
                     option.value = v.value;
                     option.textContent = v.name;
                     select_mo.appendChild(option);
                   });
                   jsSelectBox_mosaicID.appendChild(select_mo);

              });
                          

              //// ネームスペース テーブル　//////////////////////////////////////////////////////////////////////////////
              nsRepo.search({ownerAddress:accountInfo.address,
                             pageSize: 100}) /////    保有ネームスペース
              .subscribe(async ns=>{

                console.log("{ownerAddress:accountInfo.address}: ",{ownerAddress:accountInfo.address});

                var Nnames1 = new Array(ns.data.length);
                var i=0;
                var ddNamespace = new Array(ns.data.length);
                for(const nsInfo of ns.data){  
                  if(nsInfo.levels.length == 1){ //ルートネームスペース

                    const Nnames = await nsRepo.getNamespacesNames([nsInfo.levels[nsInfo.levels.length - 1]]).toPromise();
                          Nnames1[i] = Nnames[0].name;       

                    var namespace = "";
                    for(const namespaceName of Nnames){
                      if(namespace != ""){
                        namespace = "." + namespace;
                      }
                      namespace = namespaceName.name + namespace;
                    }

                    var remainHeight = nsInfo.endHeight.compact() - zip[0].height.compact();
                      //  console.log("期限が終了するブロック: " + nsInfo.endHeight.compact());  
                      //  console.log("あと残りのブロック: " + remainHeight);
                    t = dispTimeStamp(zip[0].timestamp.compact() + (remainHeight * 30000),epochAdjustment)
                 // t = dispTimeStamp(nsInfo.endHeight.compact() * 30000,epochAdjustment);
                 // ddNamespace += '<dd>' + namespace + ' [期限: ' + t + ']</dd>';
                    ddNamespace[i] = t;
                  } 
      
                  if(nsInfo.levels.length == 2){ //サブネームスペース                
                    const Nnames = await nsRepo.getNamespacesNames([nsInfo.levels[nsInfo.levels.length - 1]]).toPromise();
                    Nnames1[i] = Nnames[1].name + "." + Nnames[0].name;
                    ddNamespace[i] = t; 
                  }

                  if(nsInfo.levels.length == 3){ //サブネームスペース                
                    const Nnames = await nsRepo.getNamespacesNames([nsInfo.levels[nsInfo.levels.length - 1]]).toPromise();
                    Nnames1[i] = Nnames[2].name + "." + Nnames[1].name + "." + Nnames[0].name;
                    ddNamespace[i] = t; 
                  }

                  i=++i;
                }
                
                console.log("ns_data=",ns.data);

                console.log("ネームスペースの数",ns.data.length);
                   const select_ns = [];   // セレクトボックス初期化　（エイリアスリンク/ネームスペース）

                   var body = document.getElementById("ns_table");

                   // <table> 要素と <tbody> 要素を作成　/////////////////////////////////////////////////////
                   var tbl = document.createElement("table");
                   var tblBody = document.createElement("tbody");
                 
                   // すべてのセルを作成
                   for (var i = -1; i < ns.data.length; i++) {  // ネームスペースの数だけ繰り返す
                     // 表の行を作成
                     var row = document.createElement("tr");

                     for (var j = 0; j < 6; j++) {
                       // <td> 要素とテキストノードを作成し、テキストノードを
                       // <td> の内容として、その <td> を表の行の末尾に追加
                       var cell = document.createElement("td");                                                   
                          switch(j){
                            case 0:   //ネームスペースID
                              if (i === -1){
                                  var cellText = document.createTextNode("ネームスペース名");
                                  select_ns .push({value:"--- Select ---",name:"--- Select ---"}); //セレクトボックス用の連想配列を作る
                                  break;
                              }                        
                              var cellText = document.createTextNode(Nnames1[i]);
                                 if (zip[0].height.compact() < ns.data[i].endHeight.compact() - grace_block){  // ステータスが無効なネームスペースを排除
                                    select_ns .push({value:Nnames1[i],name:Nnames1[i]}); //セレクトボックス用の連想配列を作る                              
                                 }    
                                  break;
                            case 1:   //ネームスペース名
                              if (i === -1){
                                  var cellText = document.createTextNode("ネームスペースID");
                                  break;
                              }                            
                              if (ns.data[i].registrationType === 0){ //　ルートネームスペースの時
                                  var cellText = document.createTextNode(ns.data[i].levels[0].id.toHex());
                              }else
                                 if (ns.data[i].registrationType === 1){ //  サブネームスペースの時
                                     var cellText = document.createTextNode(ns.data[i].levels[1].id.toHex());
                                 }
                                 break;  
                            case 2:   // 有効期限
                              if (i === -1){
                                  var cellText = document.createTextNode("更新期限");
                                  break;
                              }
                              var cellText = document.createTextNode(ddNamespace[i]); 
                              break; 
                            case 3: 
                              if (i === -1){
                                  var cellText = document.createTextNode("ステータス");
                                  break;
                              }                         
                              if (zip[0].height.compact() > ns.data[i].endHeight.compact() - grace_block){
                                  var cellText = document.createTextNode("　　❌");
                              }else
                                 if (zip[0].height.compact() < ns.data[i].endHeight.compact() - grace_block){
                                     var cellText = document.createTextNode("　　🟢");
                                 }
                              break;
                            case 4:   // エイリアスタイプ
                              if (i === -1){
                                  var cellText = document.createTextNode("タイプ");
                                  break;
                              }
                              if (ns.data[i].alias.type === 0){ 
                                  var cellText = document.createTextNode("--------");
                              }else
                                 if (ns.data[i].alias.type === 1){
                                  var cellText = document.createTextNode("Mosaic");
                                 }else
                                    if (ns.data[i].alias.type === 2){
                                        var cellText = document.createTextNode("Address");
                                    }
                              break;
                            case 5:   // エイリアス
                              if (i === -1){
                                  var cellText = document.createTextNode("🔗リンク🔗");
                                  break;
                              }
                              if (ns.data[i].alias.type === 0){ 
                                var cellText = document.createTextNode("--------------------------------------------------------");
                              }else
                                 if (ns.data[i].alias.type === 1){
                                     var cellText = document.createTextNode(ns.data[i].alias.mosaicId.id.toHex());
                                 }else
                                    if (ns.data[i].alias.type === 2){
                                        var cellText = document.createTextNode(ns.data[i].alias.address.address);
                                    }
                              break;    
                            }  
                       cell.appendChild(cellText);
                       row.appendChild(cell);
                     }                     
                     // 表の本体の末尾に行を追加
                     tblBody.appendChild(row);
                   }
                   // <tbody> を <table> の中に追加
                   tbl.appendChild(tblBody);
                   // <table> を <body> の中に追加
                   body.appendChild(tbl);
                   // tbl の border 属性を 2 に設定
                   tbl.setAttribute("border", "1");


                   console.log("%cselect_ns:","color: red",select_ns); // ネームスペース　セレクトボックス ///////

                   const jsSelectBox = document.querySelector('.Namespace_select');
                   let select = document.createElement('select');

                   select.classList.add('select1');
                   select_ns.forEach((v) => {
                     const option = document.createElement('option');
                     option.value = v.value;
                     option.textContent = v.name;
                     select.appendChild(option);
                   });
                   jsSelectBox.appendChild(select);


                   /////   Namespace セレクトボックス  (Metadata用）

                   const jsSelectBox_N = document.querySelector('.Namespace_select_N');
                   const select_N = document.createElement('select');

                   select_N.classList.add('select_N');
                   select_ns.forEach((v) => {
                     const option = document.createElement('option');
                     option.value = v.value;
                     option.textContent = v.name;
                     select_N.appendChild(option);
                   });
                   jsSelectBox_N.appendChild(select_N);
                
                                 
              });
            })
          });
    /////////////////////// Meta data テーブル　/////////////////////////////////////////////////////////////// 
                  
                 metaRepo
                 .search({
                  targetAddress: accountInfo.address,
                  pageSize: 100
                }).subscribe(async data=>{
                  
                  console.log("data = = = =  ",data);

                  const select_Meta = [];   // セレクトボックス初期化　（Meta Key）

                  var body = document.getElementById("Meta_table");

                  // <table> 要素と <tbody> 要素を作成　/////////////////////////////////////////////////////
                  var tbl = document.createElement("table");
                  var tblBody = document.createElement("tbody");
                
                  // すべてのセルを作成
                  for (var i = -1; i < data.data.length; i++) {  // ネームスペースの数だけ繰り返す
                    // 表の行を作成
                    var row = document.createElement("tr");

                    for (var j = 0; j < 6; j++) {
                      // <td> 要素とテキストノードを作成し、テキストノードを
                      // <td> の内容として、その <td> を表の行の末尾に追加
                      var cell = document.createElement("td");                                                   
                         switch(j){
                           case 0:   //Metadata Key
                             if (i === -1){
                                 var cellText = document.createTextNode("Metadata Key");
                                 select_Meta.push({value:"",name:"新規 Key",type:"Type"}); //セレクトボックス用の連想配列を作る                       
                                 break;
                             }                        
                             var cellText = document.createTextNode(data.data[i].metadataEntry.scopedMetadataKey.toHex()); // scopedMetadataKey を 16進数に変換
                               if (i > -1){
                                 select_Meta.push({value:data.data[i].metadataEntry.scopedMetadataKey.toHex(),name:data.data[i].metadataEntry.scopedMetadataKey.toHex(),type:data.data[i].metadataEntry.metadataType}); //セレクトボックス用の連想配列を作る                              
                               }     
                                 break;
                           case 1:   //対象ID
                             if (i === -1){
                                 var cellText = document.createTextNode("Mosaic ID / Namespace");
                                 break;
                             }   
                             //  console.log("対象ID＝＝＝",data.data[i].metadataEntry.targetId.id);
                                 if (data.data[i].metadataEntry.targetId === undefined){                                       
                                     var cellText = document.createTextNode("N/A");      
                                 }else
                                    if(data.data[i].metadataEntry.targetId !== undefined){
                                       if (data.data[i].metadataEntry.metadataType === 1){  // モザイクの場合　ID
                                           var cellText = document.createTextNode(data.data[i].metadataEntry.targetId.id.toHex());                                 
                                       }else
                                          if (data.data[i].metadataEntry.metadataType === 2){ // ネームスペースがある場合、ID → ネームスペースに変換                                             
                                                var ns_name = await nsRepo.getNamespacesNames([data.data[i].metadataEntry.targetId.id]).toPromise(); 
                                                if (ns_name.length === 1){
                                                    var cellText = document.createTextNode([ns_name][0][0].name);
                                                }else
                                                   if (ns_name.length === 2){                                                    
                                                       var cellText = document.createTextNode([ns_name][0][1].name + "." + [ns_name][0][0].name);
                                                   }else
                                                      if (ns_name.length === 3){
                                                          var cellText = document.createTextNode([ns_name][0][2].name + "." + [ns_name][0][1].name + "." + [ns_name][0][0].name);
                                                      }
                                          }
                                    }
                                 break;  
                           case 2:   // Type
                             if (i === -1){
                                 var cellText = document.createTextNode("タイプ");
                                 break;
                             }
                             if (data.data[i].metadataEntry.metadataType === 0){
                                 var cellText = document.createTextNode("Account");
                             }else
                                if (data.data[i].metadataEntry.metadataType === 1){
                                    var cellText = document.createTextNode("Mosaic");
                                }else
                                   if (data.data[i].metadataEntry.metadataType === 2){
                                       var cellText = document.createTextNode("Namespace"); 
                                   }     
                                 break;
                           case 3:   // value
                             if (i === -1){
                                 var cellText = document.createTextNode(" メタデータ　(Value)");
                                break;
                                 }                    
                                var cellText = document.createTextNode(data.data[i].metadataEntry.value); 
                               // console.log("%cメタデータエントリー中身","color: red",data.data[i]);                  
                                break;        
                           case 4:  // 送信者アドレス
                             if (i === -1){
                                 var cellText = document.createTextNode("送信者アドレス");
                                 break;
                             }                         
                                 var cellText = document.createTextNode(data.data[i].metadataEntry.sourceAddress.address);
                                 break; 
                           case 5:   // 対象アドレス
                             if (i === -1){
                                 var cellText = document.createTextNode("対象アドレス");
                                 break;
                             }
                                 var cellText = document.createTextNode(data.data[i].metadataEntry.targetAddress.address);  
                             break;    
                              
                           }  
                      cell.appendChild(cellText);
                      row.appendChild(cell);
                    }                     
                    // 表の本体の末尾に行を追加
                    tblBody.appendChild(row);
                  }
                  // <tbody> を <table> の中に追加
                  tbl.appendChild(tblBody);
                  // <table> を <body> の中に追加
                  body.appendChild(tbl);
                  // tbl の border 属性を 2 に設定
                  tbl.setAttribute("border", "1");


                  console.log("%cselect_Meta:","color: red",select_Meta); // Metadata　セレクトボックス ///////

                  const jsSelectBox = document.querySelector('.Meta_select');
                  const select = document.createElement('select');

                  select.classList.add('select_Meta');
                  select_Meta.forEach((v) => {
                    const option = document.createElement('option');
                    option.value = v.value;
                    option.textContent = v.name;
                    select.appendChild(option);
                  });
                  jsSelectBox.appendChild(select);       
                                    
                });  
                
  

    ///////////////////////////////////////////////////////////////////////////////////////////////////////// 

          //select要素を取得する
          const selectMosaic = document.getElementById('form-mosaic_ID'); 
             
   (async() => { 
    
      for (let m of accountInfo.mosaics) {  //accountInfo のモザイクの数だけ繰り返す
	      
           mosaicInfo = await mosaicRepo.getMosaic(m.id.id).toPromise();// 可分性の情報を取得する
           const div = mosaicInfo.divisibility;
           //option要素を新しく作る
           const option1 = document.createElement('option');
          
           const mosaicNamesA = await nsRepo.getMosaicsNames([new sym.MosaicId(m.id.id.toHex())]).toPromise(); //モザイクIDからネームスペースを取り出す
         if ([mosaicNamesA][0][0].names.length !== 0) {  //  ネームスペースがある場合
        
            option1.value =   m.id.id.toHex();  // セレクトボックスvalue
            option1.textContent = `${[mosaicNamesA][0][0].names[0].name} :　${(parseInt(m.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })}`;  // セレクトボックスtext
                       
         }else{   //ネームスペースがない場合
              
               option1.value =   m.id.id.toHex();  // セレクトボックスvalue
               option1.textContent = `${m.id.id.toHex()} :　${(parseInt(m.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })}`; // セレクトボックスtext        
         }             
        if (m.id.id.toHex() === XYM_ID) {
           const dom_xym = document.getElementById('wallet-xym')
           dom_xym.innerHTML = `<i>XYM Balance : ${(parseInt(m.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })}　</i>`
        }
                // console.log("%coption1=","color: red",option1);
           //select要素にoption要素を追加する
          selectMosaic.appendChild(option1);   
	      
	      // nftdrive(m);
      }    
	   
    })(); // async() 
  })


      
//////////////////////////////////////　リスナーでトランザクションを検知し、音を鳴らす //////////////////////////////////////////////////
  
 
 // nsRepo = repo.createNamespaceRepository();
  
  wsEndpoint = NODE.replace('http', 'ws') + "/ws";
  listener = new sym.Listener(wsEndpoint,nsRepo,WebSocket); 
  
  listener.open().then(() => {

    //Websocketが切断される事なく、常時監視するために、ブロック生成(約30秒毎)の検知を行う

    // ブロック生成の検知  /////////////////////////////////////////////////////////////////
    listener.newBlock()
    .subscribe(block=>{
    //  console.log(block);    //ブロック生成 　表示OFF
    });
           
    // 未承認トランザクションの検知  ////////////////////////////////////////////////////////
    listener.unconfirmedAdded(address)
    .subscribe(tx=>{
        //受信後の処理を記述
        console.log(tx);
        // 未承認トランザクション音を鳴らす
        var my_audio = new Audio("https://github.com/symbol/desktop-wallet/raw/dev/src/views/resources/audio/ding.ogg");
        my_audio.currentTime = 0;  //再生開始位置を先頭に戻す
        my_audio.play();  //サウンドを再生 
         var popup = document.getElementById('popup'); //ポップアップを表示
             popup.classList.toggle('is-show'); 
    });    
         
    // 承認トランザクションの検知  //////////////////////////////////////////////////////////
    listener.confirmed(address)
    .subscribe(tx=>{
        //受信後の処理を記述
        console.log(tx);
         // 承認音を鳴らす   
        var my_audio = new Audio("https://github.com/symbol/desktop-wallet/raw/dev/src/views/resources/audio/ding2.ogg");
        my_audio.currentTime = 0;  //再生開始位置を先頭に戻す      
        my_audio.play();  //サウンドを再生
        var popup = document.getElementById('popup'); // ポップアップを閉じる
             popup.classList.toggle('is-show');
        window.setTimeout(function(){location.reload();},2000); // 2秒後にページをリロード
    });
  
  });

	
//////////////////////////////////////  トランザクション履歴を取得する  //////////////////////////////////////////////////////////////////////////////
                                
  
const searchCriteria = {                                   
  group: sym.TransactionGroup.Confirmed,
  address,
  pageNumber: 1,
  pageSize: 50,
  order: sym.Order.Desc,
  embedded: false,
};
	         
console.log("searchCriteria=",searchCriteria);  //////////////////
console.log("txRepo=",txRepo);   //////////////////

txRepo
  .search(searchCriteria)
  .subscribe(async txs => {
    console.log("txs=",txs);         /////////////////
     
    const dom_txInfo = document.getElementById('wallet-transactions'); 
    console.log("dom_txInfo=",dom_txInfo); ////////////////if (dom_txInfo !== null){ // null じゃなければ子ノードを全て削除  
    
    let t=1;
    let en = new Array(searchCriteria.pageSize);
    
    for (let tx of txs.data) {   ///////////////    tx を pageSize の回数繰り返す ///////////////////
         
         const dom_tx = document.createElement('div');
         const dom_date = document.createElement('div');
         const dom_txType = document.createElement('div');
         const dom_hash = document.createElement('div');
         const dom_signer_address = document.createElement('div');
         const dom_recipient_address = document.createElement('div');
      
         const dom_enc = document.createElement('div');
         const dom_message = document.createElement('div');
         const dom_namespace = document.createElement('div');
         //const dom_mosaic = document.createElement('div');
         const dom_account = document.createElement('div');
	    
         dom_txType.innerHTML = `<p style="text-align: right; line-height:100%;&"><font color="#0000ff">< ${getTransactionType(tx.type)} ></font></p>`;        //　 　Tx Type
                 
         // dom_hash.innerHTML = `<p style="text-align: right"><button type="button" class="button-txinfo"><a href="${EXPLORER}/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><i>⛓ Transaction Info ⛓</i></a></button></p>`; //Tx hash
         dom_hash.innerHTML = `<p style="text-align: right"><button type="button" class="button-txinfo" id="${EXPLORER}/transactions/${tx.transactionInfo.hash}" onclick="transaction_info(this.id);"><i>⛓ Transaction Info ⛓</i></a></button></p>`; //Tx hash 
        
         dom_signer_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">From : ${tx.signer.address.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.signer.address.address}" onclick="Onclick_Copy(this.id);" /></div>`;    //  送信者 アドレス
               
          
           ////////////////////////////////////////////　　  　timestamp to Date 　　　　　/////////////////////////
           const timestamp = epochAdjustment + (parseInt(tx.transactionInfo.timestamp.toHex(), 16)/1000);   /////////////// Unit64 を 16進数に　変換したあと10進数に変換　
           const date = new Date(timestamp * 1000);
      
           const yyyy = `${date.getFullYear()}`;
           // .slice(-2)で文字列中の末尾の2文字を取得する
           // `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
           const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()の返り値は0が基点
           const dd = `0${date.getDate()}`.slice(-2);
           const HH = `0${date.getHours()}`.slice(-2);
           const mm = `0${date.getMinutes()}`.slice(-2);
           const ss = `0${date.getSeconds()}`.slice(-2);

           const ymdhms = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
      
           //console.log(ymdhms);  // 日時を表示
      
           dom_date.innerHTML = `<font color="#7E00FF"><p style="text-align: right">${ymdhms}</p></font>`;    //　日付  右寄せ
           ///////////////////////////////////////////////////////////////////////////////////////////////////////
         
           dom_tx.appendChild(dom_hash);                      // dom_hash(⛓Transacrion info⛓) をdom_txに追加
           dom_tx.appendChild(dom_date);                      // dom_date(日付)　をdom_txに追加           	        
           dom_tx.appendChild(dom_txType);                    // dom_txType(Txタイプ) をdom_txに追加         
           dom_tx.appendChild(dom_signer_address);            // dom_signer_address(送信者アドレス) をdom_txに追加  
	    
          //  ----------------------------------------------------------------  //

          if (tx.type === 16724){ // tx.type が 'TRANSFER' の場合    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
	            if (tx.recipientAddress.address === undefined){  // 宛先が Namespace の場合 NamespaceId から取得し表示する
                    (async() => {    
	                      let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.recipientAddress.id.toHex())]).toPromise(); 
		                        dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">To　: <a href="${EXPLORER}/namespaces/${[namespacesNames][0][0].name}" target="_blank" rel="noopener noreferrer">${[namespacesNames][0][0].name}</a><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${[namespacesNames][0][0].name}" onclick="Onclick_Copy(this.id);" /></div></font>`; //  文字列の結合　   宛先                       
                    })(); // async() 
	            }else{   // Nから始まるの39文字のアドレスの場合はそのままアドレスを表示
                   dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">To　:   ${tx.recipientAddress.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.recipientAddress.address}" onclick="Onclick_Copy(this.id);" /></div>`; //  文字列の結合　   宛先
	            }	
	            dom_tx.appendChild(dom_recipient_address);         // dom_recipient_address をdom_txに追加
            
              //console.log('Tx_Mosaics =',tx.mosaics.length);  ///  モザイクの数を表示 ///////////////////////////////////////////
                  
              /////////// モザイクが空ではない場合   /////////////////　　モザイクが空の場合はこの for 文はスルーされる  //////////
              for(let i=0; i<tx.mosaics.length; i++){  //モザイクの数だけ繰り返す
                  const dom_mosaic = document.createElement('div');  
                  const dom_amount = document.createElement('div');                  
          
               (async() => {
                  let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(tx.mosaics[i].id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
		       
                  mosaicInfo = await mosaicRepo.getMosaic(tx.mosaics[i].id.id).toPromise();// 可分性の情報を取得する                     
                  let div = mosaicInfo.divisibility; // 可分性      
                  
                       if(tx.signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合　 
                      
                          if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                          }else{   　　　　　　　　　　　　　　　　　　　　　 //　ネームスペースがない場合
                              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${tx.mosaics[i].id.id.toHex()}</strong></font>`;
                          }    
                          dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(tx.mosaics[i].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量

                       }else{     //  署名アドレスとウォレットアドレスが違う場合
                           if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                                dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                           }else{ 　　　　　　　　　　　　　　　　　　　　　  // ネームスペースがない場合
                                dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${tx.mosaics[i].id.id.toHex()}</strong></font>`;   
                                // console.log("%cdom_mosaic====","color: red",tx.mosaics[i].id.id.toHex(),i);                            
                           }                           
                           dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(tx.mosaics[i].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                       }
		            // console.log("%ci モザイクが空では無い場合の処理　iだよ　",'color: red',i);
                })(); // async() 
               
                dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
                                   
              }  //モザイクの数だけ繰り返す
             //})(); // async() 
	
             if (tx.mosaics.length === 0){   // モザイクが空の場合  //////////////　モザイクがある場合はこの if 文はスルーされる
                  const dom_mosaic = document.createElement('div');
                  const dom_amount = document.createElement('div');
                  
                   if(tx.signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合
                       dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
                       dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : </font>`;     // 　数量
                   }else{          //  署名アドレスとウォレットアドレスが違う場合
                         dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
                         dom_amount.innerHTML = `<font color="#008000">💰➡️😊 : </font>`;     // 　数量        
                   } 
                   dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
		               dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
             }     /////////////////////////////////////////////////////////////////////////////////////////////////////    
                     
             if (tx.message.type === 1){   // メッセージが暗号文の時          
	               let alice;
		             let PubKey;
                 let enc_message1 = {};
                 dom_enc.innerHTML = `<font color="#ff00ff"><strong></br><ul class="decryption">暗号化メッセージ</strong>　< Encrypted Message ></font>`;     // 暗号化メッセージの場合
		     
                 dom_tx.appendChild(dom_enc);

               (async() => { 

                if (tx.recipientAddress.address !== undefined){ //送信先のアドレスが、39文字のアドレスの場合

                   if (tx.recipientAddress.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
                     if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
                     alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
      
                     }else
                        if (tx.recipientAddress.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                             alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
                        } 
            
                   }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
                              alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
                              PubKey = window.SSS.activePublicKey;
                   }

                }else{  //送信先のアドレスが、ネームスペースの場合
                   const to_address = await nsRepo.getLinkedAddress(tx.recipientAddress.id).toPromise();

		               if (to_address.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
			               if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
			               alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
				
			               }else
                        if (to_address.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
			                       alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
			                  } 
			 			 
		               }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
			                        alice = sym.Address.createFromRawAddress(to_address.address);   //アドレスクラスの生成
		                          PubKey = window.SSS.activePublicKey;
		               }                                                                       
                }   
		                       accountRepo.getAccountInfo(alice).toPromise().then((accountInfo) => { //  アドレスから公開鍵を取得する
			                     PubKey = accountInfo.publicKey;  
		                       enc_message1.message = tx.message.payload;
		                       enc_message1.PubKey = PubKey;	     	      		       
		                       en[t] = enc_message1; 
		                       // console.table(en);
		       		       
	                         dom_message.innerHTML = `<input type="button" id="${PubKey}" value="${tx.message.payload}" onclick="Onclick_Decryption(this.id, this.value);" class="button-decrypted"/></div>`;     // 　メッセージ
                           dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
                           dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く    
               
	                     }); //公開鍵を取得
               })(); // async() 
	           }else{          // 平文の場合
                 dom_message.innerHTML = `<font color="#4169e1"></br>< Message ></br>${tx.message.payload}</font>`;     // 　メッセージ
                 dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
                 dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
             }	   
          } // tx.type が 'TRANSFER' の場合

          //  ----------------------------------------------------------------  //

	        if (tx.type === 16718){       // tx.type が 'NAMESPACE_REGISTRATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	           if (tx.registrationType === 0){
              dom_namespace.innerHTML = `<font color="#008b8b">root Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
             }else
                if (tx.registrationType === 1){
              dom_namespace.innerHTML = `<font color="#008b8b">sub Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
             }
	            dom_tx.appendChild(dom_namespace);                 // namespaceをdom_txに追加
              dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
	        }///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //  ----------------------------------------------------------------  //

          if (tx.type === 17229){       // tx.type が 'MOSAIC_SUPPLY_REVOCATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const dom_mosaic = document.createElement('div');
            const dom_amount = document.createElement('div');
    
           (async() => {
              let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(tx.mosaic.id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
              mosaicInfo = await mosaicRepo.getMosaic(tx.mosaic.id.id).toPromise();// 可分性の情報を取得する                     
              let div = mosaicInfo.divisibility; // 可分性      
               
                       if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                            dom_mosaic.innerHTML = `<font color="#3399FF">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                       }else{ 　　　　　　　　　　　　　　　　　　　　　  // ネームスペースがない場合
                             dom_mosaic.innerHTML = `<font color="#3399FF">Mosaic :<strong>${tx.mosaic.id.id.toHex()}</strong></font>`;
                       }
                       dom_amount.innerHTML = `<font color="#3399FF" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(tx.mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量                
           })(); // async() 
         
            dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">回収先 :　${tx.sourceAddress.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.sourceAddress.address}" onclick="Onclick_Copy(this.id);" /></div>`;
            dom_tx.appendChild(dom_recipient_address);
            dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
            dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                           
            dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
        }
          //  ----------------------------------------------------------------  // 

          if (tx.type === 16974){       // tx.type が 'ADDRESS_ALIAS' の場合   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
           (async() => {
              let alias_Action; 
              if (tx.aliasAction === 1){
                alias_Action = "Link";
               }else
                  if(tx.aliasAction === 0){
                alias_Action = "Unlink";
               } 
              let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.namespaceId.id.toHex())]).toPromise(); 	  
              dom_namespace.innerHTML = `<font color="#008b8b">Namespace エイリアス <strong>${alias_Action}</strong></br></br>Namespace : <strong>${[namespacesNames][0][0].name} </strong></br>Address : </br><strong>${tx.address.address}</strong></font>`; 
              dom_tx.appendChild(dom_namespace);                 // dom_namespaceをdom_txに追加                                                             
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            })(); // async()           	  		  		  	  
          }
          //  ----------------------------------------------------------------  //

          if (tx.type === 17230){       // tx.type が 'MOSAIC_ALIAS' の場合	  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            (async() => {
              let alias_Action; 
              if (tx.aliasAction === 1){
                alias_Action = "Link";
               }else
                  if(tx.aliasAction === 0){
                alias_Action = "Unlink";
               }
              let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.namespaceId.id.toHex())]).toPromise();
              dom_namespace.innerHTML = `<font color="#008b8b">Mosaic エイリアス <strong>${alias_Action}</strong></br></br>Namespace : <strong>${[namespacesNames][0][0].name} </strong></br>MosaicID : <strong>${tx.mosaicId.id.toHex()}</strong></font>`;   
              dom_tx.appendChild(dom_namespace);                  // dom_namespaceをdom_txに追加                                                               
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く   
            })(); // async()          	  		  		  	  
          }
	        //  ----------------------------------------------------------------  //
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	        if (tx.type === 16961 || tx.type === 16705){      // tx.type が 'AGGREGATE_BONDED'　または 'AGGREGATE_COMPLETE' の場合		///////////////////////////////////////////////////////////////////////////////////////////////
           (async() => {      		      
                     const aggTx = await txRepo.getTransactionsById([tx.transactionInfo.hash],sym.TransactionGroup.Confirmed).toPromise();
                     console.log('%c///////////////////////////////','color: green');
		                 console.log(`%caggTx  ( ${ymdhms} )`,"color: blue",aggTx[0]);
                                                         	                                                                              
                 const dom_amount = document.createElement('div');
          
                

    		        if (aggTx[0].innerTransactions[0].type === 16724){  // TRANSFER の場合
                  
                     const dom_mosaic = document.createElement('div');
                     const dom_aggTx = document.createElement('div');

                     let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
                     mosaicInfo = await mosaicRepo.getMosaic(aggTx[0].innerTransactions[0].mosaics[0].id.id).toPromise();// 可分性の情報を取得する                     
                     let div = mosaicInfo.divisibility; // 可分性
                             
                          if (aggTx[0].innerTransactions[0].signer.address.address === address.address){  // 署名アドレスとウォレットのアドレスが同じ場合　
                      
                             if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                                 dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                             }else{                                       //　ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex()}</strong></font>`;
                             }    
                             dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaics[0].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量

                          }else{     //  署名アドレスとウォレットアドレスが違う場合
                             if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                                 dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                             }else{                                      // ネームスペースがない場合
                                   dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex()}</strong></font>`;                                  
                             }
                             dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaics[0].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
		                      }

                          if (aggTx[0].innerTransactions[0].message !== undefined){     // １つ目、2つ目のインナートランザクションにメッセージがあれば表示する。
                              dom_message.innerHTML = `<font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                          }else
                             if (aggTx[0].innerTransactions[1].message !== undefined){
                                 dom_message.innerHTML = `<font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                             }
                        
                        dom_aggTx.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font>`  // アグリの数　と　Type

                        dom_tx.appendChild(dom_aggTx);                     // dom_aggTx をdom_txに追加
                        dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                        dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加   
	              }   

                if (aggTx[0].innerTransactions[0].type === 16717){ // MOSAIC_REGISTRATION の場合
                    const dom_mosaic = document.createElement('div');
                    dom_mosaic.innerHTML = `<font color="#008b8b">Mosaic 登録 :　<big><strong>${aggTx[0].innerTransactions[0].mosaicId.id.toHex()}</strong></big></font>`; 
                    dom_tx.appendChild(dom_mosaic);                  // dom_mosaicをdom_txに追加
                }

                if (aggTx[0].innerTransactions[0].type === 16708){ // ACCOUNT_METADATAの場合
                    dom_account.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Account</font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Address : ${window.SSS.activeAddress}</strong></big></font>`; 
                    dom_tx.appendChild(dom_account);
                }

                if (aggTx[0].innerTransactions[0].type === 16964){ // MOSAIC_METADATA の場合
                    const dom_mosaic = document.createElement('div');
                    dom_mosaic.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Mosaic </font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Mosaic ID: 　${aggTx[0].innerTransactions[0].targetMosaicId.toHex()}</strong></big></font>`;
                    dom_tx.appendChild(dom_mosaic);                  // dom_mosaicをdom_txに追加      
                } 

                if (aggTx[0].innerTransactions[0].type === 17220){ // NAMESPACE_METADATA
                    var ns_name_Meta = await nsRepo.getNamespacesNames([aggTx[0].innerTransactions[0].targetNamespaceId.id]).toPromise();                       
                    dom_namespace.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Namespace</font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Namespace :　${[ns_name_Meta][0][0].name}</strong></big></font>`; 
                    dom_tx.appendChild(dom_namespace);                  // dom_namespaceをdom_txに追加
                }

                if (aggTx[0].innerTransactions[0].type === 16722){ // SECRET_LOCK
                    const dom_aggTx = document.createElement('div');                                                                                                     
                    if (aggTx[0].innerTransactions[0].mosaic !== undefined){   
                         const dom_mosaic = document.createElement('div');                  
                         let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(aggTx[0].innerTransactions[0].mosaic.id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
                          mosaicInfo = await mosaicRepo.getMosaic(aggTx[0].innerTransactions[0].mosaic.id.id).toPromise();// 可分性の情報を取得する                     
                          let div = mosaicInfo.divisibility; // 可分性
                  
                          if(aggTx[0].innerTransactions[0].signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合　
                             if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                                 dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                             }else{                                       //　ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaic.id.id.toHex()}</strong></font>`;
                             }    
                             dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                          }else{     //  署名アドレスとウォレットアドレスが違う場合
                             if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                                                       
                                 dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                             }else{                                      // ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaic.id.id.toHex()}</strong></font>`;
                             }
                             dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                          }

                        dom_aggTx.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font>`;                      
                        dom_tx.appendChild(dom_aggTx);                     // dom_aggTx をdom_txに追加        
                        dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                        dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                                                           
                    }                   
                    
                    if (aggTx[0].innerTransactions[0].message !== undefined){     // １つ目、2つ目のインナートランザクションにメッセージがあれば表示する。 
                        dom_message.innerHTML = `</br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                    }else
                       if (aggTx[0].innerTransactions[1].message !== undefined){
                           dom_message.innerHTML = `</br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                       }  
                }
                    dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加
                    dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く  
              })(); // async() 
          }	    	    
            //dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加

            console.log('%c= = = = = = = = = = = = = = = =','color: green');
            console.log(`%ctx[${t}][${ymdhms}] =`,"color: blue",tx);      //　トランザクションをコンソールに表示　//////////////////
	    t = ++t;
    }    // tx の数だけループ処理 
  })	// txRepo.search(searchCriteria).toPromise().then((txs) =>
}, 1000)



// Transaction Type を返す関数  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getTransactionType (type) { // https://symbol.github.io/symbol-sdk-typescript-javascript/1.0.3/enums/TransactionType.html
  switch(type){
    case 16720:
      return 'ACCOUNT_ADDRESS_RESTRICTION';
      break;
    case 16716:
      return 'ACCOUNT_KEY_LINK';
      break;  
    case 16708:
      return 'ACCOUNT_METADATA';
      break;
    case 16976:
      return 'ACCOUNT_MOSAIC_RESTRICTION';
      break;
    case 17232:
      return 'ACCOUNT_OPERATION_RESTRICTION';
      break;
    case 16974:
      return 'ADDRESS_ALIAS';
      break;
    case 16961:
      return 'AGGREGATE_BONDED';
      break;
    case 16705:
      return 'AGGREGATE_COMPLETE';
      break;
    case 16712:
      return 'HASH_LOCK';
      break;
    case 16977:
      return 'MOSAIC_ADDRESS_RESTRICTION';
      break;
    case 17230:
      return 'MOSAIC_ALIAS';
      break;
    case 16717:
      return 'MOSAIC_DEFINITION';
      break;
    case 16721:
      return 'MOSAIC_GLOBAL_RESTRICTION';
      break;
    case 16964:
      return 'MOSAIC_METADATA';
      break;
    case 16973:
      return 'MOSAIC_SUPPLY_CHANGE';
      break;
    case 17229:
      return 'MOSAIC_SUPPLY_REVOCATION';
      break;
    case 16725:
      return 'MULTISIG_ACCOUNT_MODIFICATION';
      break;
    case 17220:
      return 'NAMESPACE_METADATA';
      break;
    case 16718:
      return 'NAMESPACE_REGISTRATION';
      break;
    case 16972:
      return 'NODE_KEY_LINK';
      break;
    case 0:
      return 'RESERVED';
      break;
    case 16722:
      return 'SECRET_LOCK';
      break;
    case 16978:
      return 'SECRET_PROOF';
      break;
    case 16724:
      return 'TRANSFER';
      break;
    case 16707:
      return 'VOTING_KEY_LINK';
      break;
    case 16963:
      return 'VRF_KEY_LINK';
      break;  
    default:
      return 'Other';
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// handleSSS関数はトランザクションを作成し、window.SSS.setTransaction関数を実行しSSSにトランザクションを登録します。
// そしてwindow.SSS.requestSign関数を実行し、SSSを用いた署名をユーザ－に要求します。

function handleSSS() {      
  console.log('handle sss');
  let addr = document.getElementById('form-addr').value;
  const mosaic_ID = document.getElementById('form-mosaic_ID').value;
  const amount = document.getElementById('form-amount').value;
  const message = document.getElementById('form-message').value;
  const enc = document.getElementById('form-enc').value;
  const maxfee = document.getElementById('form-maxfee').value;

        addr = addr.replace(/-/g,"");  // ハイフンを削除する

     
     if (addr.charAt(0) === 'N'){  // MAINNET の場合 
         epochAdjustment = EPOCH_M; 
         // XYM_ID = XYM_ID_M;
         networkType = NET_TYPE_M;
         txRepo = txRepo_M;
     }else
        if (addr.charAt(0) === 'T'){ //TESTNET の場合
            epochAdjustment = EPOCH_T; 
            // XYM_ID = XYM_ID_T;
            networkType = NET_TYPE_T
            txRepo = txRepo_T;
        }
    
 (async() => {  
     mosaicInfo = await mosaicRepo.getMosaic(new sym.MosaicId(mosaic_ID)).toPromise();// 可分性の情報を取得する 
     const div = mosaicInfo.divisibility; // 可分性

   if (address1.length === 0){ // アグリゲートTxの配列が空の場合    < transfer>
     if (enc === "0"){                      //////////////// メッセージが平文の場合 ////////////////////////////////////

       if (addr.length === 39){  //文字数が39文字の場合
        const tx = sym.TransferTransaction.create(        // トランザクションを生成
        sym.Deadline.create(epochAdjustment),
        sym.Address.createFromRawAddress(addr),
        [
          new sym.Mosaic(
            new sym.MosaicId(mosaic_ID),
            sym.UInt64.fromUint(Number(amount)*10**div) // div 可分性を適用
          )
        ],
        sym.PlainMessage.create(message),
        networkType,
        sym.UInt64.fromUint(1000000*Number(maxfee))          // MaxFee 設定
       )
        window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
        window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
        console.log('signedTx', signedTx);
        txRepo.announce(signedTx);
        })
       }else{ // 文字数が39以外の場合　(ネームスペース)
        const namespaceId = new sym.NamespaceId(addr);
      
      //const address = await nsRepo.getLinkedAddress(namespaceId).toPromise();
      //  const address = await nsRepo.getNamespace(namespaceId).toPromise();
      //  console.log("725 address")
      //  if (address === undefined ){
      //    alert("NameSpace Error !!")
      //  }

        const tx = sym.TransferTransaction.create(        // トランザクションを生成
          sym.Deadline.create(epochAdjustment),
          namespaceId,
          [
            new sym.Mosaic(
              new sym.MosaicId(mosaic_ID),
              sym.UInt64.fromUint(Number(amount)*10**div) // div 可分性を適用
            )
          ],
          sym.PlainMessage.create(message),
          networkType,
          sym.UInt64.fromUint(1000000*Number(maxfee))          // MaxFee 設定
         )        
          window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
          window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
          console.log('signedTx', signedTx);
          txRepo.announce(signedTx);
          })
        } 
     }else
        if (enc === "1"){                ////////////// メッセージが暗号の場合 /////////////////////////////////////////////////
          if (addr.length === 39){  //文字数が39文字の場合
             const alice = sym.Address.createFromRawAddress(addr);   //アドレスクラスの生成
             accountInfo = await accountRepo.getAccountInfo(alice).toPromise();  //　送信先アドレスの公開鍵を取得する
             console.log("accontInfo=",accountInfo);
             
             const pubkey = accountInfo.publicKey;
             window.SSS.setMessage(message, pubkey);
             window.SSS.requestSignEncription().then((msg) => {
                 setTimeout(() => {
                   console.log({ msg });
                   const tx = sym.TransferTransaction.create(        // トランザクションを生成
                   sym.Deadline.create(epochAdjustment),
                   sym.Address.createFromRawAddress(addr),
                   [
                     new sym.Mosaic(
                       new sym.MosaicId(mosaic_ID),
                       sym.UInt64.fromUint(Number(amount)*10**div) // div 可分性を適用
                     )
                   ],
                   msg,
                   networkType,
                   sym.UInt64.fromUint(1000000*Number(maxfee))          // MaxFee 設定  
                   )
                   window.SSS.setTransaction(tx);               // SSSにトランザクションを登録
                   window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求                   
                   console.log('signedTx', signedTx);
                   txRepo.announce(signedTx);    
                   })
                 }, 1000)      
             });  
            }else{ // 文字数が39以外の場合 (ネームスペース)
             const namespaceId = new sym.NamespaceId(addr);
             const address = await nsRepo.getLinkedAddress(namespaceId).toPromise();
             const alice = sym.Address.createFromRawAddress(address.address);   //アドレスクラスの生成
             accountInfo = await accountRepo.getAccountInfo(alice).toPromise();  //　送信先アドレスの公開鍵を取得する
             console.log("accontInfo=",accountInfo);
             
             const pubkey = accountInfo.publicKey;
             window.SSS.setMessage(message, pubkey);
             window.SSS.requestSignEncription().then((msg) => {
                 setTimeout(() => {
                   console.log({ msg });
                   const tx = sym.TransferTransaction.create(        // トランザクションを生成
                   sym.Deadline.create(epochAdjustment),
                   namespaceId,
                   [
                     new sym.Mosaic(
                       new sym.MosaicId(mosaic_ID),
                       sym.UInt64.fromUint(Number(amount)*10**div) // div 可分性を適用
                     )
                   ],
                   msg,
                   networkType,
                   sym.UInt64.fromUint(1000000*Number(maxfee))          // MaxFee 設定  
                   )
                   window.SSS.setTransaction(tx);               // SSSにトランザクションを登録
                   window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求                   
                   console.log('signedTx', signedTx);
                   txRepo.announce(signedTx);    
                   })
                 }, 1000)      
             });               
            }
      }
   }else{            //////////    aggregate Tx   /////////////////////////////////////////////
                  let innerTx = [];
                  for (let i=0; i<address1.length; i++){
			                        innerTx[i] = sym.TransferTransaction.create(
                              undefined, //Deadline
                              sym.Address.createFromRawAddress(address1[i]), //送信先
                              [
                                  new sym.Mosaic(
                                      new sym.MosaicId(mosaic_ID),
                                      sym.UInt64.fromUint(Number(amount)*10**div) // div 可分性を適用  
                                      )
                              ],
                              sym.PlainMessage.create(message),
                              networkType
                         );
                  }

                  const publicAccount = sym.PublicAccount.createFromPublicKey(
                    window.SSS.activePublicKey,
                    networkType
                  );

                  for (let i=0; i<address1.length; i++){
                      innerTx[i] = innerTx[i].toAggregate(publicAccount)
                  }

                  const aggregateTx = sym.AggregateTransaction.createComplete(
                    sym.Deadline.create(epochAdjustment),  //Deadline
                    innerTx,
                    networkType,
                    [],
                    sym.UInt64.fromUint(1000000*Number(maxfee)*20)          //最大手数料 2XYM
                  )

                 window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
                 window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
                 console.log('signedTx', signedTx);
                 txRepo.announce(signedTx);
                 })  
   }
	 
  })(); // async()  
    
}

/////////////////////////////////////////////////////////////////////////////////////////////
// 未承認状態の時にpopup する
// ポップアップのセッティング処理
function popupSetting(){
  let popup = document.getElementById('popup');
  if(!popup) return;

  let bgBlack = document.getElementById('bg-black');
  let showBtn = document.getElementById('show-btn');

  // ポップアップ
  popUp(bgBlack);
  popUp(showBtn);

  // ポップアップ処理
  function popUp(elem){
    if(!elem) return;
    elem.addEventListener('click', function(){
      popup.classList.toggle('is-show');
    });
  }
}

// ポップアップのセッティング
popupSetting();


/////////////////////// セレクトボックスの Page No を変更した時にトランザクション履歴を再読み込みする //////////////////////////////////////////////////////////////////
  

function select_Page() {

 const address = sym.Address.createFromRawAddress(window.SSS.activeAddress);
  
  const check_netType = address.address.charAt(0);     // 1文字目を抽出

   if (check_netType === 'N'){           //ネットワークの判別　 メインネット 
       epochAdjustment = EPOCH_M;
       NODE = NODE_URL_M;
       networkType = NET_TYPE_M;
       generationHash = GENERATION_HASH_M;
       XYM_ID = XYM_ID_M;
     
       repo = repo_M;
       accountRepo = accountRepo_M;
       txRepo = txRepo_M;
       mosaicRepo = mosaicRepo_M;
       nsRepo = nsRepo_M;
       
      console.log("MAIN_NET");
   }else 
      if (check_netType === 'T'){      // テストネット
          epochAdjustment = EPOCH_T;
          NODE = NODE_URL_T;
          networkType = NET_TYPE_T;
	        generationHash = GENERATION_HASH_T;
          XYM_ID = XYM_ID_T;
        
          repo = repo_T;
          accountRepo = accountRepo_T;
          txRepo = txRepo_T;
          mosaicRepo = mosaicRepo_T;
          nsRepo = nsRepo_T;
        
          console.log("TEST_NET");
      }
       console.log("check_netType=",check_netType);
 
  
  
const page_num = document.getElementById('page_num1').value;  /////////  セレクトボックスから、Page No を取得  ///////////////////////
  
const searchCriteria = {                                   
  group: sym.TransactionGroup.Confirmed,
  address,
  pageNumber: page_num,
  pageSize: 50,
  order: sym.Order.Desc,
  embedded: false,
};
         
console.log("searchCriteria=",searchCriteria);  //////////////////
console.log("txRepo=",txRepo);   //////////////////

const dom_txInfo = document.getElementById('wallet-transactions'); 
    console.log("dom_txInfo=",dom_txInfo); ////////////////
    if (dom_txInfo !== null){ // null じゃなければ子ノードを全て削除  
      while(dom_txInfo.firstChild){
          dom_txInfo.removeChild(dom_txInfo.firstChild);
      }
    }

//////////////////////////////////////////////////////////////////


txRepo
  .search(searchCriteria)
  .subscribe(async txs => {
    console.log("txs=",txs);         /////////////////
     
    const dom_txInfo = document.getElementById('wallet-transactions'); 
    console.log("dom_txInfo=",dom_txInfo); ////////////////if (dom_txInfo !== null){ // null じゃなければ子ノードを全て削除  
    
    let t=1;
    let en = new Array(searchCriteria.pageSize);
    
    for (let tx of txs.data) {   ///////////////    tx を pageSize の回数繰り返す ///////////////////
         
         const dom_tx = document.createElement('div');
         const dom_date = document.createElement('div');
         const dom_txType = document.createElement('div');
         const dom_hash = document.createElement('div');
         const dom_signer_address = document.createElement('div');
         const dom_recipient_address = document.createElement('div');
      
         const dom_enc = document.createElement('div');
         const dom_message = document.createElement('div');
         const dom_namespace = document.createElement('div');
         //const dom_mosaic = document.createElement('div');
         const dom_account = document.createElement('div');
	    
         dom_txType.innerHTML = `<p style="text-align: right; line-height:100%;&"><font color="#0000ff">< ${getTransactionType(tx.type)} ></font></p>`;        //　 　Tx Type
                 
         // dom_hash.innerHTML = `<p style="text-align: right"><button type="button" class="button-txinfo"><a href="${EXPLORER}/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><i>⛓ Transaction Info ⛓</i></a></button></p>`; //Tx hash
         dom_hash.innerHTML = `<p style="text-align: right"><button type="button" class="button-txinfo" id="${EXPLORER}/transactions/${tx.transactionInfo.hash}" onclick="transaction_info(this.id);"><i>⛓ Transaction Info ⛓</i></a></button></p>`; //Tx hash 
        
         dom_signer_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">From : ${tx.signer.address.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.signer.address.address}" onclick="Onclick_Copy(this.id);" /></div>`;    //  送信者 アドレス
               
          
           ////////////////////////////////////////////　　  　timestamp to Date 　　　　　/////////////////////////
           const timestamp = epochAdjustment + (parseInt(tx.transactionInfo.timestamp.toHex(), 16)/1000);   /////////////// Unit64 を 16進数に　変換したあと10進数に変換　
           const date = new Date(timestamp * 1000);
      
           const yyyy = `${date.getFullYear()}`;
           // .slice(-2)で文字列中の末尾の2文字を取得する
           // `0${date.getHoge()}`.slice(-2) と書くことで０埋めをする
           const MM = `0${date.getMonth() + 1}`.slice(-2); // getMonth()の返り値は0が基点
           const dd = `0${date.getDate()}`.slice(-2);
           const HH = `0${date.getHours()}`.slice(-2);
           const mm = `0${date.getMinutes()}`.slice(-2);
           const ss = `0${date.getSeconds()}`.slice(-2);

           const ymdhms = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
      
           //console.log(ymdhms);  // 日時を表示
      
           dom_date.innerHTML = `<font color="#7E00FF"><p style="text-align: right">${ymdhms}</p></font>`;    //　日付  右寄せ
           ///////////////////////////////////////////////////////////////////////////////////////////////////////
         
           dom_tx.appendChild(dom_hash);                      // dom_hash(⛓Transacrion info⛓) をdom_txに追加
           dom_tx.appendChild(dom_date);                      // dom_date(日付)　をdom_txに追加           	        
           dom_tx.appendChild(dom_txType);                    // dom_txType(Txタイプ) をdom_txに追加         
           dom_tx.appendChild(dom_signer_address);            // dom_signer_address(送信者アドレス) をdom_txに追加  
	    
          //  ----------------------------------------------------------------  //

          if (tx.type === 16724){ // tx.type が 'TRANSFER' の場合    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////      
	            if (tx.recipientAddress.address === undefined){  // 宛先が Namespace の場合 NamespaceId から取得し表示する
                    (async() => {    
	                      let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.recipientAddress.id.toHex())]).toPromise(); 
		                        dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">To　: <a href="${EXPLORER}/namespaces/${[namespacesNames][0][0].name}" target="_blank" rel="noopener noreferrer">${[namespacesNames][0][0].name}</a><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${[namespacesNames][0][0].name}" onclick="Onclick_Copy(this.id);" /></div></font>`; //  文字列の結合　   宛先                       
                    })(); // async() 
	            }else{   // Nから始まるの39文字のアドレスの場合はそのままアドレスを表示
                   dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">To　:   ${tx.recipientAddress.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.recipientAddress.address}" onclick="Onclick_Copy(this.id);" /></div>`; //  文字列の結合　   宛先
	            }	
	            dom_tx.appendChild(dom_recipient_address);         // dom_recipient_address をdom_txに追加
            
              //console.log('Tx_Mosaics =',tx.mosaics.length);  ///  モザイクの数を表示 ///////////////////////////////////////////
                  
              /////////// モザイクが空ではない場合   /////////////////　　モザイクが空の場合はこの for 文はスルーされる  //////////
              for(let i=0; i<tx.mosaics.length; i++){  //モザイクの数だけ繰り返す
                  const dom_mosaic = document.createElement('div');  
                  const dom_amount = document.createElement('div');                  
          
               (async() => {
                  let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(tx.mosaics[i].id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
		       
                  mosaicInfo = await mosaicRepo.getMosaic(tx.mosaics[i].id.id).toPromise();// 可分性の情報を取得する                     
                  let div = mosaicInfo.divisibility; // 可分性      
                  
                       if(tx.signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合　 
                      
                          if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                          }else{   　　　　　　　　　　　　　　　　　　　　　 //　ネームスペースがない場合
                              dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${tx.mosaics[i].id.id.toHex()}</strong></font>`;
                          }    
                          dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(tx.mosaics[i].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量

                       }else{     //  署名アドレスとウォレットアドレスが違う場合
                           if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                                dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                           }else{ 　　　　　　　　　　　　　　　　　　　　　  // ネームスペースがない場合
                                dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${tx.mosaics[i].id.id.toHex()}</strong></font>`;   
                                // console.log("%cdom_mosaic====","color: red",tx.mosaics[i].id.id.toHex(),i);                            
                           }                           
                           dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(tx.mosaics[i].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                       }
		            // console.log("%ci モザイクが空では無い場合の処理　iだよ　",'color: red',i);
                })(); // async() 
               
                dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
                                   
              }  //モザイクの数だけ繰り返す
             //})(); // async() 
	
             if (tx.mosaics.length === 0){   // モザイクが空の場合  //////////////　モザイクがある場合はこの if 文はスルーされる
                  const dom_mosaic = document.createElement('div');
                  const dom_amount = document.createElement('div');
                  
                   if(tx.signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合
                       dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
                       dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : </font>`;     // 　数量
                   }else{          //  署名アドレスとウォレットアドレスが違う場合
                         dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
                         dom_amount.innerHTML = `<font color="#008000">💰➡️😊 : </font>`;     // 　数量        
                   } 
                   dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
		               dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
             }     /////////////////////////////////////////////////////////////////////////////////////////////////////    
                     
             if (tx.message.type === 1){   // メッセージが暗号文の時          
	               let alice;
		             let PubKey;
                 let enc_message1 = {};
                 dom_enc.innerHTML = `<font color="#ff00ff"><strong></br><ul class="decryption">暗号化メッセージ</strong>　< Encrypted Message ></font>`;     // 暗号化メッセージの場合
		     
                 dom_tx.appendChild(dom_enc);

               (async() => { 

                if (tx.recipientAddress.address !== undefined){ //送信先のアドレスが、39文字のアドレスの場合

                   if (tx.recipientAddress.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
                     if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
                     alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
      
                     }else
                        if (tx.recipientAddress.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                             alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
                        } 
            
                   }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
                              alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
                              PubKey = window.SSS.activePublicKey;
                   }

                }else{  //送信先のアドレスが、ネームスペースの場合
                   const to_address = await nsRepo.getLinkedAddress(tx.recipientAddress.id).toPromise();

		               if (to_address.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
			               if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
			               alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
				
			               }else
                        if (to_address.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
			                       alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
			                  } 
			 			 
		               }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
			                        alice = sym.Address.createFromRawAddress(to_address.address);   //アドレスクラスの生成
		                          PubKey = window.SSS.activePublicKey;
		               }                                                                       
                }   
		                       accountRepo.getAccountInfo(alice).toPromise().then((accountInfo) => { //  アドレスから公開鍵を取得する
			                     PubKey = accountInfo.publicKey;  
		                       enc_message1.message = tx.message.payload;
		                       enc_message1.PubKey = PubKey;	     	      		       
		                       en[t] = enc_message1; 
		                       // console.table(en);
		       		       
	                         dom_message.innerHTML = `<input type="button" id="${PubKey}" value="${tx.message.payload}" onclick="Onclick_Decryption(this.id, this.value);" class="button-decrypted"/></div>`;     // 　メッセージ
                           dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
                           dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く    
               
	                     }); //公開鍵を取得
               })(); // async() 
	           }else{          // 平文の場合
                 dom_message.innerHTML = `<font color="#4169e1"></br>< Message ></br>${tx.message.payload}</font>`;     // 　メッセージ
                 dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
                 dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
             }	   
          } // tx.type が 'TRANSFER' の場合

          //  ----------------------------------------------------------------  //

	        if (tx.type === 16718){       // tx.type が 'NAMESPACE_REGISTRATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	           if (tx.registrationType === 0){
              dom_namespace.innerHTML = `<font color="#008b8b">root Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
             }else
                if (tx.registrationType === 1){
              dom_namespace.innerHTML = `<font color="#008b8b">sub Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
             }
	            dom_tx.appendChild(dom_namespace);                 // namespaceをdom_txに追加
              dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
	        }///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          //  ----------------------------------------------------------------  //

          if (tx.type === 17229){       // tx.type が 'MOSAIC_SUPPLY_REVOCATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            const dom_mosaic = document.createElement('div');
            const dom_amount = document.createElement('div');
    
           (async() => {
              let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(tx.mosaic.id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
              mosaicInfo = await mosaicRepo.getMosaic(tx.mosaic.id.id).toPromise();// 可分性の情報を取得する                     
              let div = mosaicInfo.divisibility; // 可分性      
               
                       if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                            dom_mosaic.innerHTML = `<font color="#3399FF">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                       }else{ 　　　　　　　　　　　　　　　　　　　　　  // ネームスペースがない場合
                             dom_mosaic.innerHTML = `<font color="#3399FF">Mosaic :<strong>${tx.mosaic.id.id.toHex()}</strong></font>`;
                       }
                       dom_amount.innerHTML = `<font color="#3399FF" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(tx.mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量                
           })(); // async() 
         
            dom_recipient_address.innerHTML = `<div class="copy_container"><font color="#2f4f4f">回収先 :　${tx.sourceAddress.address}</font><input type="image" src="src/copy.png" class="copy_bt" height="20px" id="${tx.sourceAddress.address}" onclick="Onclick_Copy(this.id);" /></div>`;
            dom_tx.appendChild(dom_recipient_address);
            dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
            dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                           
            dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
        }
          //  ----------------------------------------------------------------  // 

          if (tx.type === 16974){       // tx.type が 'ADDRESS_ALIAS' の場合   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////        
           (async() => {
              let alias_Action; 
              if (tx.aliasAction === 1){
                alias_Action = "Link";
               }else
                  if(tx.aliasAction === 0){
                alias_Action = "Unlink";
               } 
              let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.namespaceId.id.toHex())]).toPromise(); 	  
              dom_namespace.innerHTML = `<font color="#008b8b">Namespace エイリアス <strong>${alias_Action}</strong></br></br>Namespace : <strong>${[namespacesNames][0][0].name} </strong></br>Address : </br><strong>${tx.address.address}</strong></font>`; 
              dom_tx.appendChild(dom_namespace);                 // dom_namespaceをdom_txに追加                                                             
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            })(); // async()           	  		  		  	  
          }
          //  ----------------------------------------------------------------  //

          if (tx.type === 17230){       // tx.type が 'MOSAIC_ALIAS' の場合	  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            (async() => {
              let alias_Action; 
              if (tx.aliasAction === 1){
                alias_Action = "Link";
               }else
                  if(tx.aliasAction === 0){
                alias_Action = "Unlink";
               }
              let namespacesNames = await nsRepo.getNamespacesNames([sym.NamespaceId.createFromEncoded(tx.namespaceId.id.toHex())]).toPromise();
              dom_namespace.innerHTML = `<font color="#008b8b">Mosaic エイリアス <strong>${alias_Action}</strong></br></br>Namespace : <strong>${[namespacesNames][0][0].name} </strong></br>MosaicID : <strong>${tx.mosaicId.id.toHex()}</strong></font>`;   
              dom_tx.appendChild(dom_namespace);                  // dom_namespaceをdom_txに追加                                                               
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く   
            })(); // async()          	  		  		  	  
          }
	        //  ----------------------------------------------------------------  //
          /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	        if (tx.type === 16961 || tx.type === 16705){      // tx.type が 'AGGREGATE_BONDED'　または 'AGGREGATE_COMPLETE' の場合		///////////////////////////////////////////////////////////////////////////////////////////////
           (async() => {      		      
                     const aggTx = await txRepo.getTransactionsById([tx.transactionInfo.hash],sym.TransactionGroup.Confirmed).toPromise();
                     console.log('%c///////////////////////////////','color: green');
		                 console.log(`%caggTx  ( ${ymdhms} )`,"color: blue",aggTx[0]);
                                                         	                                                                              
                 const dom_amount = document.createElement('div');
          
                

    		        if (aggTx[0].innerTransactions[0].type === 16724){  // TRANSFER の場合
                  
                     const dom_mosaic = document.createElement('div');
                     const dom_aggTx = document.createElement('div');

                     let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
                     mosaicInfo = await mosaicRepo.getMosaic(aggTx[0].innerTransactions[0].mosaics[0].id.id).toPromise();// 可分性の情報を取得する                     
                     let div = mosaicInfo.divisibility; // 可分性
                             
                          if (aggTx[0].innerTransactions[0].signer.address.address === address.address){  // 署名アドレスとウォレットのアドレスが同じ場合　
                      
                             if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                                 dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                             }else{                                       //　ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex()}</strong></font>`;
                             }    
                             dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaics[0].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量

                          }else{     //  署名アドレスとウォレットアドレスが違う場合
                             if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                         
                                 dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                             }else{                                      // ネームスペースがない場合
                                   dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaics[0].id.id.toHex()}</strong></font>`;                                  
                             }
                             dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaics[0].amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
		                      }

                          if (aggTx[0].innerTransactions[0].message !== undefined){     // １つ目、2つ目のインナートランザクションにメッセージがあれば表示する。
                              dom_message.innerHTML = `<font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                          }else
                             if (aggTx[0].innerTransactions[1].message !== undefined){
                                 dom_message.innerHTML = `<font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                             }
                        
                        dom_aggTx.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font>`  // アグリの数　と　Type

                        dom_tx.appendChild(dom_aggTx);                     // dom_aggTx をdom_txに追加
                        dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                        dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加   
	              }   

                if (aggTx[0].innerTransactions[0].type === 16717){ // MOSAIC_REGISTRATION の場合
                    const dom_mosaic = document.createElement('div');
                    dom_mosaic.innerHTML = `<font color="#008b8b">Mosaic 登録 :　<big><strong>${aggTx[0].innerTransactions[0].mosaicId.id.toHex()}</strong></big></font>`; 
                    dom_tx.appendChild(dom_mosaic);                  // dom_mosaicをdom_txに追加
                }

                if (aggTx[0].innerTransactions[0].type === 16708){ // ACCOUNT_METADATAの場合
                    dom_account.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Account</font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Address : ${window.SSS.activeAddress}</strong></big></font>`; 
                    dom_tx.appendChild(dom_account);
                }

                if (aggTx[0].innerTransactions[0].type === 16964){ // MOSAIC_METADATA の場合
                    const dom_mosaic = document.createElement('div');
                    dom_mosaic.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Mosaic </font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Mosaic ID: 　${aggTx[0].innerTransactions[0].targetMosaicId.toHex()}</strong></big></font>`;
                    dom_tx.appendChild(dom_mosaic);                  // dom_mosaicをdom_txに追加      
                } 

                if (aggTx[0].innerTransactions[0].type === 17220){ // NAMESPACE_METADATA
                    var ns_name_Meta = await nsRepo.getNamespacesNames([aggTx[0].innerTransactions[0].targetNamespaceId.id]).toPromise();                       
                    dom_namespace.innerHTML = `<font color="#ff6347"><big>METADATA登録 :　　Namespace</font><br><strong><font color="#008b8b"> Key :　${aggTx[0].innerTransactions[0].scopedMetadataKey.toHex()}<br>Namespace :　${[ns_name_Meta][0][0].name}</strong></big></font>`; 
                    dom_tx.appendChild(dom_namespace);                  // dom_namespaceをdom_txに追加
                }

                if (aggTx[0].innerTransactions[0].type === 16722){ // SECRET_LOCK
                    const dom_aggTx = document.createElement('div');                                                                                                     
                    if (aggTx[0].innerTransactions[0].mosaic !== undefined){   
                         const dom_mosaic = document.createElement('div');                  
                         let mosaicNames = await nsRepo.getMosaicsNames([new sym.MosaicId(aggTx[0].innerTransactions[0].mosaic.id.id.toHex())]).toPromise(); // Namespaceの情報を取得する
     
                          mosaicInfo = await mosaicRepo.getMosaic(aggTx[0].innerTransactions[0].mosaic.id.id).toPromise();// 可分性の情報を取得する                     
                          let div = mosaicInfo.divisibility; // 可分性
                  
                          if(aggTx[0].innerTransactions[0].signer.address.address === address.address) {  // 署名アドレスとウォレットのアドレスが同じ場合　
                             if ([mosaicNames][0][0].names.length !==0){  // ネームスペースがある場合
                                 dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`; 
                             }else{                                       //　ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaic.id.id.toHex()}</strong></font>`;
                             }    
                             dom_amount.innerHTML = `<font color="#FF0000" size="+1">💁‍♀️➡️💰 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                          }else{     //  署名アドレスとウォレットアドレスが違う場合
                             if ([mosaicNames][0][0].names.length !==0){ // ネームスペースがある場合                                                       
                                 dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<big><strong>${[mosaicNames][0][0].names[0].name}</strong></big></font>`;
                             }else{                                      // ネームスペースがない場合
                                  dom_mosaic.innerHTML = `<font color="#008000">Mosaic :　<strong>${aggTx[0].innerTransactions[0].mosaic.id.id.toHex()}</strong></font>`;
                             }
                             dom_amount.innerHTML = `<font color="#008000" size="+1">💰➡️😊 :　<i><big><strong> ${(parseInt(aggTx[0].innerTransactions[0].mosaic.amount.toHex(), 16)/(10**div)).toLocaleString(undefined, { maximumFractionDigits: 6 })} </big></strong><i></font>`;    // 　数量
                          }

                        dom_aggTx.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font>`;                      
                        dom_tx.appendChild(dom_aggTx);                     // dom_aggTx をdom_txに追加        
                        dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                        dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                                                           
                    }                   
                    
                    if (aggTx[0].innerTransactions[0].message !== undefined){     // １つ目、2つ目のインナートランザクションにメッセージがあれば表示する。 
                        dom_message.innerHTML = `</br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                    }else
                       if (aggTx[0].innerTransactions[1].message !== undefined){
                           dom_message.innerHTML = `</br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                       }  
                }
                    dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加
                    dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く  
              })(); // async() 
          }	    	    
            //dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加

            console.log('%c= = = = = = = = = = = = = = = =','color: green');
            console.log(`%ctx[${t}][${ymdhms}] =`,"color: blue",tx);      //　トランザクションをコンソールに表示　//////////////////
	    t = ++t;
    }    // tx の数だけループ処理 
  })

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                              // 暗号化メッセージを復号する //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


 
function Onclick_Decryption(PubKey,encryptedMessage){
    console.log("%cPubkeyだよ","color: blue",PubKey)
    console.log("%cencryptedMessageだよ","color: green",encryptedMessage)
	
    window.SSS.setEncryptedMessage(
            encryptedMessage,
            PubKey
    )
		
    window.SSS.requestSignDecription().then((data) => {
            console.log(data);
	    
	    swal(`暗号化メッセージ < Encrypted Message >

	    >>${encryptedMessage}
	    
	    復号化メッセージ < Decrypted Message >

	    >>${data}`); // ポップアップで表示
    })		
}

///////////////  Transaction Info ボタン ///////////////////////////

function transaction_info(url){ 
  window.open(url);  // hash からエクスプローラーを開く
}

///////////// /  タイムスタンプ  ////////////////////////////////////////////
function dispTimeStamp(timeStamp,epoch){

	const d = new Date(timeStamp + epoch * 1000)
	const strDate = d.getFullYear()%100
		+ "-" + paddingDate0( d.getMonth() + 1 )
		+ '-' + paddingDate0( d.getDate() )
		+ ' ' + paddingDate0( d.getHours() )
		+ ':' + paddingDate0( d.getMinutes() ) ;
	return 	strDate;
}

function getDateId(timeStamp,epoch){
	const d = new Date(timeStamp + epoch * 1000)
	const dateId = d.getFullYear()
		+ paddingDate0( d.getMonth() + 1 )
		+ paddingDate0( d.getDate() );
	return 	dateId;

}

function paddingDate0(num) {
	return ( num < 10 ) ? '0' + num  : '' + num;
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // Copyボタンをクリックして、クリップボードにコピー
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function Onclick_Copy(copy_address){

  console.log("Copy_address=",copy_address);       // 正しいアドレスが表示されている
  console.log("コピーボタンが押されたよ");

  
      let COPY_COMPLETE = document.createElement('div');
      COPY_COMPLETE.innerHTML = `　　　　<strong style="color: green;"><font size="6">Copied!</font></strong>`;
  
     
      const COPY_BT = document.querySelector('h2');
      console.log(COPY_BT);
        
      COPY_BT.replaceWith(COPY_COMPLETE);
      setTimeout( () => {
          COPY_COMPLETE.replaceWith(COPY_BT);
      },700); 
        
  
    navigator.clipboard.writeText(copy_address);
 
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                              // モザイク作成 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Onclick_mosaic(){
  
  const supplyAmount = document.getElementById("SupplyAmount").value;
  const duration = document.getElementById("Duration1").value;
  const divisibility = document.getElementById("Divisibility").value;
  const supplyMutable = document.getElementById("Supply_M").checked;
  const transferable = document.getElementById("Transferable").checked;
  const restrictable = document.getElementById("Restrictable").checked;
  const revokable = document.getElementById("Revokable").checked;
  const maxFee = document.getElementById("re_maxFee_m").value;

  console.log("duration=",duration);
  console.log("supplyMutable=",supplyMutable);
  console.log("transferable=",transferable);
  console.log("restrictable=",restrictable);
  console.log("revokable=",revokable);

//supplyMutable = true; //供給量変更の可否
//transferable = true; //第三者への譲渡可否
//restrictable = true; //制限設定の可否
//revokable = true; //発行者からの還収可否

  const address = sym.Address.createFromRawAddress(window.SSS.activeAddress); //アカウントのアドレスを取得

  const publicAccount = sym.PublicAccount.createFromPublicKey(                //アカウントの公開鍵を取得
    window.SSS.activePublicKey,
    networkType
  );

//モザイク定義
  const nonce = sym.MosaicNonce.createRandom();
  const mosaicDefTx = sym.MosaicDefinitionTransaction.create(
            undefined,
            nonce,
            sym.MosaicId.createFromNonce(nonce, address), //モザイクID
            sym.MosaicFlags.create(supplyMutable, transferable, restrictable, revokable),
            divisibility, //divisibility:可分性
            sym.UInt64.fromUint(duration), //duration:有効期限
            networkType
        );
  
    console.log(mosaicDefTx);

  const  mosaicChangeTx = sym.MosaicSupplyChangeTransaction.create(
             undefined,
             mosaicDefTx.mosaicId,
             sym.MosaicSupplyChangeAction.Increase,
             sym.UInt64.fromUint(supplyAmount), //数量
             networkType
        );

        console.log(mosaicChangeTx);

  const aggregateTx = sym.AggregateTransaction.createComplete(
          sym.Deadline.create(epochAdjustment),
          [
            mosaicDefTx.toAggregate(publicAccount),
            mosaicChangeTx.toAggregate(publicAccount),
          ],
          networkType,[],
          sym.UInt64.fromUint(1000000*Number(maxFee)) 
      )
  
      window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      })  

}

//////////////////////////////////////////////////////////////////////////
//                   モザイク回収
/////////////////////////////////////////////////////////////////////////

async function revoke_mosaic(){

  const holderAddress = document.getElementById("holderAddress").value;
  const mosaic_ID = document.querySelector(".select_r").value;
  const amount = document.getElementById("re_amount").value;
  const maxFee = document.getElementById("re_maxFee_r").value;


  const mosaicInfo = await mosaicRepo.getMosaic(new sym.MosaicId(mosaic_ID)).toPromise();// 可分性の情報を取得する 
  const div = mosaicInfo.divisibility; // 可分性

  const revoke_tx = sym.MosaicSupplyRevocationTransaction.create(
    sym.Deadline.create(epochAdjustment),
    sym.Address.createFromRawAddress(holderAddress),
    new sym.Mosaic(
      new sym.MosaicId(mosaic_ID),     // mosice ID 16進数　
      sym.UInt64.fromUint(Number(amount)*10**div)),      // mosaic 数量  可分性を適用する                                  
    networkType,
    sym.UInt64.fromUint(1000000*Number(maxFee)) 
  )

  window.SSS.setTransaction(revoke_tx);               // SSSにトランザクションを登録        
  window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
  console.log('signedTx', signedTx);
  txRepo.announce(signedTx);
  }) 


}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                              // Namespace 作成 //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Onclick_Namespace(){
  
  const Namespace = document.getElementById("Namespace").value;
  const duration = document.getElementById("Duration2").value;
  const maxFee = document.getElementById("re_maxFee_n").value;
  

  console.log("Namespace=",Namespace);
  console.log("Duration=",duration);
  console.log("maxFee===",maxFee);
  

  // ルートネームスペースをレンタルする
      const tx = sym.NamespaceRegistrationTransaction.createRootNamespace(
          sym.Deadline.create(epochAdjustment),
          Namespace,
          sym.UInt64.fromUint(duration),
          networkType,
          sym.UInt64.fromUint(1000000*Number(maxFee))   
      )

      window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      }) 

}


//  サブネームスペースを取得する /////////////////////////////////////////////////////////////
function Onclick_subNamespace(){
  
  const rootNamespace = document.getElementById("rootNamespace").value;
  const subNamespace = document.getElementById("subNamespace").value;
  const maxFee = document.getElementById("re_maxFee_sn").value;
  
  console.log("rootNamespace=",rootNamespace);
  console.log("subNamespace=",subNamespace);
  

      const tx = sym.NamespaceRegistrationTransaction.createSubNamespace(
          sym.Deadline.create(epochAdjustment),
          subNamespace,
          rootNamespace,
          networkType,
          sym.UInt64.fromUint(1000000*Number(maxFee))   
      )

      window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      }) 

}




///////////////////////////////////////////////////////////////////////////////
//                 エイリアスリンク　　
///////////////////////////////////////////////////////////////////////////////

function alias_Link(){

  const Namespace = document.querySelector("select1").value;
  const Address_Mosaic = document.getElementById("Link_Address").value;
  //const Mosaic_ID = document.getElementById("Link_Mosaic_ID").value;
  const maxFee = document.getElementById("re_maxFee_L").value;
  const alias_type = document.getElementById("alias_type").value;

  console.log("Namespace=",Namespace);
  console.log("Address_Mosaic=",Address_Mosaic)
  console.log("maxFee=",maxFee);
  console.log("alias_type=",alias_type);

  //アカウントへリンク  /////////////////////////////
  if (alias_type === "0"){
    const namespaceId = new sym.NamespaceId(Namespace);
    const address = sym.Address.createFromRawAddress(Address_Mosaic);

    tx = sym.AliasTransaction.createForAddress(
       sym.Deadline.create(epochAdjustment),
       sym.AliasAction.Link,
       namespaceId,
       address,
       networkType,
       sym.UInt64.fromUint(1000000*Number(maxFee)) 
    )
   
        window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
        window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
        console.log('signedTx', signedTx);
        txRepo.announce(signedTx);
        })
  }

  // モザイクへリンク  /////////////////////////////
  if (alias_type === "1"){
    const namespaceId = new sym.NamespaceId(Namespace);
    const mosaicId = new sym.MosaicId(Address_Mosaic);
  
    tx = sym.AliasTransaction.createForMosaic(
       sym.Deadline.create(epochAdjustment),
       sym.AliasAction.Link,
       namespaceId,
       mosaicId,
       networkType,
       sym.UInt64.fromUint(1000000*Number(maxFee)) 
    )

        window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
        window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
        console.log('signedTx', signedTx);
        txRepo.announce(signedTx);
        })    
  }

  //アカウントからリンク解除  ////////////////////////
  if (alias_type === "2"){
    const namespaceId = new sym.NamespaceId(Namespace);
    const address = sym.Address.createFromRawAddress(Address_Mosaic);

    tx = sym.AliasTransaction.createForAddress(
       sym.Deadline.create(epochAdjustment),
       sym.AliasAction.Unlink,
       namespaceId,
       address,
       networkType,
       sym.UInt64.fromUint(1000000*Number(maxFee)) 
    )
   
        window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
        window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
        console.log('signedTx', signedTx);
        txRepo.announce(signedTx);
        })
  }

  // モザイクからリンク解除 ////////////////////////////
  if (alias_type === "3"){
    const namespaceId = new sym.NamespaceId(Namespace);
    const mosaicId = new sym.MosaicId(Address_Mosaic);
  
    tx = sym.AliasTransaction.createForMosaic(
       sym.Deadline.create(epochAdjustment),
       sym.AliasAction.Unlink,
       namespaceId,
       mosaicId,
       networkType,
       sym.UInt64.fromUint(1000000*Number(maxFee)) 
    )

        window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
        window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
        console.log('signedTx', signedTx);
        txRepo.announce(signedTx);
        })    
  }
}

/////////////////////////////////////////////////////////////////////////////////
//    Metadata 登録
/////////////////////////////////////////////////////////////////////////////////

async function Metadata(){

  const Meta_type = document.getElementById("Meta_type").value;   // Metadata登録先
  const Meta_key = document.querySelector(".select_Meta").value;     // Metadata Key
  //const Meta_to = document.querySelector(".Meta_to").value;       // Address / MosaicID / Namespace
  const mosaicID = document.querySelector(".select_mo").value;   //  MosaicID
  const Namespace = document.querySelector(".select_N").value;  // Namespace
  const Meta_value = document.getElementById("Meta_value").value; // value値
  const maxFee = document.getElementById("re_maxFee_Meta").value; //  maxFee値
  const address = sym.Address.createFromRawAddress(window.SSS.activeAddress);

  console.log("Meta_type===",Meta_type);
 // console.log("Meta_to===",Meta_to);
  console.log("Meta_key===",Meta_key);
  console.log("Meta_value===",Meta_value);
  console.log("maxFee===",maxFee);
  console.log("Meta_address===",address);
  console.log("mosaicID===",mosaicID);
  console.log("Namespace===",Namespace);

  const publicAccount = sym.PublicAccount.createFromPublicKey(                //アカウントの公開鍵を取得
    window.SSS.activePublicKey,
    networkType
  );

  if (Meta_key === ""){
    key = sym.KeyGenerator.generateUInt64Key(Math.random().toString(36).slice(2)); //適当な文字列からメタデータキーを生成
  }else
     if (Meta_key !== undefined){
         key = new sym.MosaicId(Meta_key); // 16進数　→ Uint64に変換
         key = key.id;
  }
  value = Meta_value;



  if (Meta_type === "0"){ // アカウントに登録 //////////////////////////
      
      tx = await metaService
      .createAccountMetadataTransaction(
        undefined,
        networkType,
        address, //メタデータ記録先アドレス
        key,
        value, //Key-Value値
        address //メタデータ作成者アドレス
      )
      .toPromise();
  
      aggregateTx = sym.AggregateTransaction.createComplete(
        sym.Deadline.create(epochAdjustment),
        [tx.toAggregate(publicAccount)],
        networkType,
        [],
        sym.UInt64.fromUint(1000000*Number(maxFee))
      )

      window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      })

  }
  if (Meta_type === "1"){ // モザイクに登録 ///////////////////////////
      const mosaicId = new sym.MosaicId(mosaicID);
      const mosaicInfo = await mosaicRepo.getMosaic(mosaicId).toPromise();           
    
      tx = await metaService
        .createMosaicMetadataTransaction(
          undefined,
          networkType,
          mosaicInfo.ownerAddress, //モザイク作成者アドレス
          mosaicId,
          key,
          value, //Key-Value値
          address
        )
        .toPromise();
    
      aggregateTx = sym.AggregateTransaction.createComplete(
        sym.Deadline.create(epochAdjustment),
        [tx.toAggregate(publicAccount)],
        networkType,
        [],
        sym.UInt64.fromUint(1000000*Number(maxFee))
      )

      window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      })

  }
  if (Meta_type === "2"){ // ネームスペースに登録 /////////////////////////
      const namespaceId = new sym.NamespaceId(Namespace);
      console.log("namespaceId===",namespaceId);
      const namespaceInfo = await nsRepo.getNamespace(namespaceId).toPromise(); 
    
      tx = await metaService
        .createNamespaceMetadataTransaction(
          undefined,
          networkType,
          namespaceInfo.ownerAddress, //ネームスペースの作成者アドレス
          namespaceId,
          key,
          value, //Key-Value値
          address //メタデータの登録者
        )
        .toPromise();
    
      aggregateTx = sym.AggregateTransaction.createComplete(
        sym.Deadline.create(epochAdjustment),
        [tx.toAggregate(publicAccount)],
        networkType,
        [],
        sym.UInt64.fromUint(1000000*Number(maxFee))
      )

      window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      })
    }

}

/////////////////////////////////////////////////////////////////////////////////
//    ネームスペースチェック
/////////////////////////////////////////////////////////////////////////////////

async function ns_check(){
  const ns = document.getElementById('Namespace').value;   // ネームスペースを取得  //
  console.log("ns=: ",ns);

}


//////////////////////////////////////////////////////////////////////////////////
//     ネームスペース　手数料計算
//////////////////////////////////////////////////////////////////////////////////


async function feeCalc(){
    const rentalBlock = document.getElementById('Duration2').value;  // 有効期限を取得  //
    console.log("レンタルブロック: "+rentalBlock);
    rentalFees = await nwRepo.getRentalFees().toPromise();
    rootNsperBlock = rentalFees.effectiveRootNamespaceRentalFeePerBlock.compact();
    rootNsRenatalFeeTotal = rentalBlock * rootNsperBlock;
    rootNsRenatalFeeTotal = rootNsRenatalFeeTotal / 1000000;
    console.log("rentalBlock:" + rentalBlock);
    console.log("rootNsRenatalFeeTotal:" + rootNsRenatalFeeTotal);
    console.log("ネームスペース作成手数料: "+rootNsRenatalFeeTotal);
      
    const ns_fee1 = document.getElementById("ns_fee");
    ns_fee1.innerHTML =`<p style="font-size:20px;color:blue;">レンタル手数料　 ${rootNsRenatalFeeTotal} XYM</p>`
    return;
  
}

//////////////////////////////////////////////////////////////////////////////////
//     モザイク有効期限計算
//////////////////////////////////////////////////////////////////////////////////

function ex_date1(){
    const rentalBlock = document.getElementById('Duration1').value;  // 有効期限を取得  //
    console.log("レンタルブロック: "+rentalBlock);
    chainRepo.getChainInfo().subscribe(chain=>{  //////////   

      rxjs.zip(
        blockRepo1.getBlockByHeight(chain.height),
        blockRepo1.getBlockByHeight(chain.latestFinalizedBlock.height),
      ).subscribe(zip => {
          
        if (rentalBlock === "0"){
           t = "無期限 ∞";
        }else{
           t = dispTimeStamp(zip[0].timestamp.compact() + (rentalBlock * 30000),epochAdjustment)
        }
          console.log("有効期限=: ",t);
    
          const ex_date1 = document.getElementById("ex_date1");
          ex_date1.innerHTML =`<p style="font-size:20px;color:blue">　　有効期限　 ${t}</p>`

      })
    })
    return;
}

//////////////////////////////////////////////////////////////////////////////////
//     ネームスペース有効期限計算
//////////////////////////////////////////////////////////////////////////////////

function ex_date2(){
  const rentalBlock = document.getElementById('Duration2').value;    // 有効期限を取得  //
  console.log("レンタルブロック: "+rentalBlock);
  chainRepo.getChainInfo().subscribe(chain=>{  //////////   

    rxjs.zip(
      blockRepo1.getBlockByHeight(chain.height),
      blockRepo1.getBlockByHeight(chain.latestFinalizedBlock.height),
    ).subscribe(zip => {
  
        t = dispTimeStamp(zip[0].timestamp.compact() + (rentalBlock * 30000),epochAdjustment)
        console.log("有効期限=: ",t);
  
        const ex_date2 = document.getElementById("ex_date2");
        ex_date2.innerHTML =`<p style="font-size:20px;color:blue">　　有効期限　 ${t}</p>`

    })
  })
  return;
}

//////////////////////////////////////////////////////////////////////////////////
//     Metadata Key　セレクトボックス
//////////////////////////////////////////////////////////////////////////////////

function MetaKey_select(){
  const Meta_type = document.getElementById('Meta_type').value;    // Metadata Typeを取得  //
  const Meta_to = document.getElementById('Meta_to');
  const Meta_table = document.getElementById('Meta_table');
  const select_Meta = document.querySelector('.select_Meta');

  if (Meta_type === "0"){    // Account の時は　アドレスを表示
    document.getElementById('Meta_to').placeholder = window.SSS.activeAddress;
  }
  if (Meta_type === "1"){    // Mosaic
    document.getElementById('Meta_to').placeholder = "";


  }
  if (Meta_type === "2"){    // Namespace
    document.getElementById('Meta_to').placeholder = "";    
  }
  if (Meta_type === "-1"){   // select 
    document.getElementById('Meta_to').placeholder = ""; 
  }

   console.log("セレクトメタ==",select_Meta);
   console.log("メタテーブル==",Meta_table);
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                              //  NFTをデコードして表示する //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*

function appendImg(src){          //   取得した画像をimgタグに挿入するfunctionを定義

  (tag= document.createElement('img')).src = src;
  document.getElementsByTagName('body')[0].appendChild(tag);
}
//////////////////////////////////////////////////////////////////////////////


var nglist = [];
fetch('https://nftdrive-explorer.info/black_list/',)
.then((response) => {
    return response.text().then(function(text) {
        nglist = JSON.parse(text);      
        console.log(text);
    });
});


function nftdrive(mosaic){
	mosaicRepo.getMosaic(mosaic.id)
	.pipe(
		op.filter(mo=>{
			return !nglist.find(elem => elem[1] === mo.id.toHex())
		})
	)
	.subscribe(async mo=>{

		const ownerAddress = mo.ownerAddress;
		const preTxes = await txRepo.search({
			type:[
				sym.TransactionType.TRANSFER,
			],
			address:ownerAddress,group:sym.TransactionGroup.Confirmed,pageSize:10,order:sym.Order.Asc
		}).toPromise();

		if(preTxes.data.find(tx => {
			if(tx.message === undefined){
				return false;
			}else if(tx.message.payload==="Please note that this mosaic is an NFT."){
				needSample = false;
				return true;
			}else{
				return false;
			}
		})){

			const tx = await txRepo.search({
				type:[
					sym.TransactionType.AGGREGATE_COMPLETE,
					sym.TransactionType.AGGREGATE_BONDED,
				],
				address:ownerAddress,group:sym.TransactionGroup.Confirmed,pageSize:100
			}).toPromise();

			const aggTxes = [];
			for (let idx = 0; idx < tx.data.length; idx++) {
				const aggTx = await txRepo.getTransaction(tx.data[idx].transactionInfo.hash,sym.TransactionGroup.Confirmed).toPromise();

				if(aggTx.innerTransactions.find(elem => elem.type === 16724)){
					aggTxes.push(aggTx);
				}
			}

			const sotedAggTxes = aggTxes.sort(function(a, b) {

				if (Number(a.innerTransactions[0].message.payload) > Number(b.innerTransactions[0].message.payload)) {return 1;} else {return -1;}
			})

			let nftData = "";
			let header = 15;
			for (let aggTx of sotedAggTxes) {

				for(let idx = 0 + header; idx < aggTx.innerTransactions.length;idx++){
					nftData += aggTx.innerTransactions[idx].message.payload;
				}
				header = 1;
			}
                             
			 console.log(nftData);
			if(nftData.indexOf("data:image/") >= 0){
				appendImg(nftData);
			}
		}
	});
}
*/
