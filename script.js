const dom_version = document.getElementById('version');
dom_version.innerHTML = 'v1.0.9　|　Powered by SYMBOL';

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
        
          console.log("TEST_NET");
      }
       console.log("check_netType=",check_netType);
     

const dom_netType = document.getElementById('netType');  // network Type を表示　
     
  if (networkType === NET_TYPE_M){   
     dom_netType.innerHTML = '<font color="#ff00ff">< MAIN_NET ></font>'
  }else
     if (networkType === NET_TYPE_T){
        dom_netType.innerHTML = '<font color="ff8c00">< TEST_NET ></font>'
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

              //ネームスペース
              nsRepo.search({ownerAddress:accountInfo.address}) /////    保有ネームスペース
              .subscribe(async ns=>{

                
                var ddNamespace = "";
                for(const nsInfo of ns.data){                  
                  if(nsInfo.levels.length == 1){

                    const Nnames = await nsRepo.getNamespacesNames([nsInfo.levels[nsInfo.levels.length - 1]]).toPromise();
        
                    const namespaceInfo = await nsRepo.getNamespace(new sym.NamespaceId(Nnames[0].name)).toPromise();
                    console.log(namespaceInfo);
                   
                    console.log("保有names=",Nnames[0].name);////

                    var namespace = "";
                    for(const namespaceName of Nnames){
                      if(namespace != ""){
                        namespace = "." + namespace;
                      }
                      namespace = namespaceName.name + namespace;
                    }

                    var remainHeight = nsInfo.endHeight.compact() - zip[0].height.compact();
                    t = dispTimeStamp(zip[0].timestamp.compact() + (remainHeight * 30000),epochAdjustment)
                 // t = dispTimeStamp(nsInfo.endHeight.compact() * 30000,epochAdjustment);
                    ddNamespace += '<dd>' + namespace + ' [期限: ' + t + ']</dd>';
                  } 

                }
                console.log("namespace_data",ns.data);

                console.log("ネームスペースの数",ns.data.length);

              /*  const ns_table1 = document.getElementById('ns_table');    // NameSpace テーブル 
                const ns_table2 = document.createElement('div');
                
                  // ns_table.innerHTML = '';
		               ns_table2.innerHTML ='<tr class="ns_table"><td>00000</td> <td>abc.coin</td> <td>23-5-12</td> <td>false</td> <td>Mosaic</td> <td>aaa</td></tr>';

                   ns_table1.appendChild(ns_table2);  */

                   var body = document.getElementById("ns_table");

                   // <table> 要素と <tbody> 要素を作成
                   var tbl = document.createElement("table");
                   var tblBody = document.createElement("tbody");
                 
                   // すべてのセルを作成
                   for (var i = 0; i < ns.data.length; i++) {  // ネームスペースの数だけ繰り返す
                     // 表の行を作成
                     var row = document.createElement("tr");
                 
                     for (var j = 0; j < 6; j++) {
                       // <td> 要素とテキストノードを作成し、テキストノードを
                       // <td> の内容として、その <td> を表の行の末尾に追加
                       var cell = document.createElement("td");
                                                      
                          switch(j){
                            case 0:
                              var cellText = document.createTextNode("Id");
                              break;
                            case 1:
                              var cellText = document.createTextNode("名前");
                              break;  
                            case 2:
                              var cellText = document.createTextNode("有効期限");
                              break; 
                            case 3:
                              var cellText = document.createTextNode("期限切れ");
                              break; 
                            case 4:
                              var cellText = document.createTextNode("エイリアスタイプ");
                              break;
                            case 5:
                              var cellText = document.createTextNode("エイリアス");
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


 
                if(ddNamespace !== ""){
                  $("#account_append_info").append('<dt>ルートネームスペース</dt>'+ ddNamespace);
                }
                console.log("ddNamespace=",ddNamespace);/////
              });
            })
          });
     ////
     
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
  .toPromise()
  .then((txs) => {
    console.log("txs=",txs);         /////////////////
     
    const dom_txInfo = document.getElementById('wallet-transactions'); 
    console.log("dom_txInfo=",dom_txInfo); ////////////////
    
    let t=0;
    let en = new Array(searchCriteria.pageSize);
    
    for (let tx of txs.data) {   ///////////////    tx を pageSize の回数繰り返す ///////////////////
         console.log(`%ctx[${t}] =`,"color: blue",tx);      //　トランザクションを表示　//////////////////
         const dom_tx = document.createElement('div');
         const dom_date = document.createElement('div');
         const dom_txType = document.createElement('div');
         const dom_hash = document.createElement('div');
         const dom_signer_address = document.createElement('div');
         const dom_recipient_address = document.createElement('div');
      
         const dom_enc = document.createElement('div');
         const dom_message = document.createElement('div');
         const dom_namespace = document.createElement('div');
         const dom_mosaicID = document.createElement('div');
	    
         dom_txType.innerHTML = `<p style="text-align: right; line-height:100%;&"><font color="#0000ff">< ${getTransactionType(tx.type)} ></font></p>`;        //　 　Tx Type
                 
         dom_hash.innerHTML = `<p style="text-align: right; font-weight:bold; line-height:100%;&"><a href="${EXPLORER}/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><i>⛓ Transaction Info ⛓</i></a></p>`; //Tx hash
           
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
         
           dom_tx.appendChild(dom_date);                      // dom_date(日付)　をdom_txに追加           
	         dom_tx.appendChild(dom_hash);                      // dom_hash(⛓Transacrion info⛓) をdom_txに追加
           dom_tx.appendChild(dom_txType);                    // dom_txType(Txタイプ) をdom_txに追加         
           dom_tx.appendChild(dom_signer_address);            // dom_signer_address(送信者アドレス) をdom_txに追加  
	    
 
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
                                     //console.log("%csigner と wallet address が同じ時",'color: blue')
                     alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
      
                     }else
                        if (tx.recipientAddress.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                            //console.log("%crecipient と wallet address が同じ時",'color: blue')
                             alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
                        } 
            
                   }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
                              //console.log("%c送信アドレス と 送信元アドレスが同じ",'color: green')
                              alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
                              PubKey = window.SSS.activePublicKey;
                   }

                }else{  //送信先のアドレスが、ネームスペースの場合
                   const to_address = await nsRepo.getLinkedAddress(tx.recipientAddress.id).toPromise();

		               if (to_address.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
			               if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
                                     //console.log("%csigner と wallet address が同じ時",'color: blue')
			               alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
				
			               }else
                        if (to_address.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                            //console.log("%crecipient と wallet address が同じ時",'color: blue')
			                       alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
			                  } 
			 			 
		               }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
			                        //console.log("%c送信アドレス と 送信元アドレスが同じ",'color: green')
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


	        if (tx.type === 16718){       // tx.type が 'NAMESPACE_REGISTRATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	            dom_namespace.innerHTML = `<font color="#008b8b">Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
	            dom_tx.appendChild(dom_namespace);                 // namespaceをdom_txに追加
              dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
	        }

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
              dom_tx.appendChild(dom_namespace);                  // dom_mosaicIDをdom_txに追加                                                               
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く   
            })(); // async()          	  		  		  	  
          }

	    
	        if (tx.type === 16705 || tx.type === 16961){      // tx.type が 'AGGREGATE_BONDED'　または 'AGGREGATE_COMPLETE' の場合		///////////////////////////////////////////////////////////////////////////////////////////////
            (async() => {      		      
                     const aggTx = await txRepo.getTransactionsById([tx.transactionInfo.hash],sym.TransactionGroup.Confirmed).toPromise();
		                 console.log("aggTx=",aggTx[0]);

		                 if (aggTx[0].innerTransactions[0].message !== undefined){
                         dom_message.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font></br></br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                     }else
                        if (aggTx[0].innerTransactions[1].message !== undefined){
                          dom_message.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font></br></br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                     }             
             // })(); // async()
		   
             
              //let mosaic_num = aggTx[0].innerTransactions[0].mosaics.length;
              //  let mosaic_num = 1;

		            /////////// モザイクが空ではない場合   /////////////////　　モザイクが空の場合はこの for 文はスルーされる  //////////
             // for(let i=0; i<mosaic_num; i++){  //モザイクの数だけ繰り返す
                //console.log("aggTx mosaic for文 (i=)",i);
                 const dom_mosaic = document.createElement('div');
                 const dom_amount = document.createElement('div');
          
               // (async() => {              
		       if (aggTx[0].innerTransactions[0].type === 16724){  // TRANSFER の場合 
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
	         }else
              if (aggTx[0].innerTransactions[0].type === 16717){ // MOSAIC_REGISTRATION の場合
                 dom_mosaicID.innerHTML = `<font color="#008b8b">Mosaic 登録 :　<big><strong>${aggTx[0].innerTransactions[0].mosaicId.id.toHex()}</strong></big></font>`; 
                 dom_tx.appendChild(dom_mosaicID);                  // dom_mosaicIDをdom_txに追加                                                        	     
	         }else{
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
           }

		           // console.log("%ci モザイクが空では無い場合の処理　iだよ　",'color: red',i);
               //  })(); // async()  
               
                dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                                                           
                                   
             //   }  //モザイクの数だけ繰り返す ////////////////////////////////////////////////////////////////////////////////////
                dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加
                dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            })(); // async()  
	      
            /* if (aggTx[0].innerTransactions[0].mosaics.length === 0){   // モザイクが空の場合  //////////////　モザイクがある場合はこの if 文はスルーされる
                  const dom_mosaic = document.createElement('div');
              　　 const dom_amount = document.createElement('div');
                  
                   if(tx.recipientAddress.address !== address.address) {  // 受け取りアドレスとウォレットのアドレスが違う場合
                       dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
                       dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : </font>`;     // 　数量
                   }else{          //  受け取りアドレスとウォレットアドレスが同じ場合
         　            　 dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
                         dom_amount.innerHTML = `<font color="#008000">💰➡️😊 : </font>`;     // 　数量        
                   } 
                  　dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                　　dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
             } /////////////////////////////////////////////////////////////////////////////////////////////////////  */          		      
	        }	    
	    
            //dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加
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
  const addr = document.getElementById('form-addr').value;
  const mosaic_ID = document.getElementById('form-mosaic_ID').value;
  const amount = document.getElementById('form-amount').value;
  const message = document.getElementById('form-message').value;
  const enc = document.getElementById('form-enc').value;
  const maxfee = document.getElementById('form-maxfee').value;
     
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

txRepo
  .search(searchCriteria)
  .toPromise()
  .then((txs) => {
    console.log("txs=",txs);         /////////////////
     
    const dom_txInfo = document.getElementById('wallet-transactions'); 
    console.log("dom_txInfo=",dom_txInfo); ////////////////
    if (dom_txInfo !== null){ // null じゃなければ子ノードを全て削除  
      while(dom_txInfo.firstChild){
          dom_txInfo.removeChild(dom_txInfo.firstChild);
      }
    }
    
    let t=0;
    let en = new Array(searchCriteria.pageSize);
    
    for (let tx of txs.data) {   ///////////////    tx を pageSize の回数繰り返す ///////////////////
         console.log(`%ctx[${t}] =`,"color: blue",tx);      //　トランザクションを表示　//////////////////
         const dom_tx = document.createElement('div');
         const dom_date = document.createElement('div');
         const dom_txType = document.createElement('div');
         const dom_hash = document.createElement('div');
         const dom_signer_address = document.createElement('div');
         const dom_recipient_address = document.createElement('div');
      
         const dom_enc = document.createElement('div');
         const dom_message = document.createElement('div');
         const dom_namespace = document.createElement('div');
         const dom_mosaicID = document.createElement('div');
	    
         dom_txType.innerHTML = `<p style="text-align: right; line-height:100%;&"><font color="#0000ff">< ${getTransactionType(tx.type)} ></font></p>`;        //　 　Tx Type
         
         /////  エクスプローラー　URLの変更  ////
         if (check_netType === 'N'){   // MAINNET の場合          
             dom_hash.innerHTML = `<p style="text-align: right; font-weight:bold; line-height:100%;&"><a href="https://symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><i>⛓ Transaction Info ⛓</i></a></p>`; //Tx hash
         }else
            if (check_netType === 'T'){ // TESTNET の場合             
                dom_hash.innerHTML = `<p style="text-align: right; font-weight:bold; line-height:100%;&"><a href="https://testnet.symbol.fyi/transactions/${tx.transactionInfo.hash}" target="_blank" rel="noopener noreferrer"><i>⛓ Transaction Info ⛓</i></a></p>`; //Tx hash          
            }
         
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
         
           dom_tx.appendChild(dom_date);                      // dom_date(日付)　をdom_txに追加           
	         dom_tx.appendChild(dom_hash);                      // dom_hash(⛓Transacrion info⛓) をdom_txに追加
           dom_tx.appendChild(dom_txType);                    // dom_txType(Txタイプ) をdom_txに追加         
           dom_tx.appendChild(dom_signer_address);            // dom_signer_address(送信者アドレス) をdom_txに追加  
	    
 
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
                                     //console.log("%csigner と wallet address が同じ時",'color: blue')
                     alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
      
                     }else
                        if (tx.recipientAddress.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                            //console.log("%crecipient と wallet address が同じ時",'color: blue')
                             alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
                        } 
            
                   }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
                              //console.log("%c送信アドレス と 送信元アドレスが同じ",'color: green')
                              alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
                              PubKey = window.SSS.activePublicKey;
                   }

                }else{  //送信先のアドレスが、ネームスペースの場合
                   const to_address = await nsRepo.getLinkedAddress(tx.recipientAddress.id).toPromise();

		               if (to_address.address !== tx.signer.address.address){    // 送信先アドレスと、送信元アドレスが異なる場合  ///////////////////////////////
			               if (tx.signer.address.address === address.address){   // 署名アドレスと、ウォレットアドレスが同じ場合
                                     //console.log("%csigner と wallet address が同じ時",'color: blue')
			               alice = sym.Address.createFromRawAddress(tx.recipientAddress.address);   //アドレスクラスの生成
				
			               }else
                        if (to_address.address === address.address){ // 送信先アドレスと、ウォレットアドレスが同じ場合
                            //console.log("%crecipient と wallet address が同じ時",'color: blue')
			                       alice = sym.Address.createFromRawAddress(tx.signer.address.address);   //アドレスクラスの生成			
			                  } 
			 			 
		               }else{    // 送信先アドレスと、ウォレットアドレスが同じ場合
			                        //console.log("%c送信アドレス と 送信元アドレスが同じ",'color: green')
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


	        if (tx.type === 16718){       // tx.type が 'NAMESPACE_REGISTRATION' の場合	  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	            dom_namespace.innerHTML = `<font color="#008b8b">Namespace 登録 :　<big><strong>${tx.namespaceName}</strong></big></font>`; 
	            dom_tx.appendChild(dom_namespace);                 // namespaceをdom_txに追加
              dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加                                                              
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く          	  		  		  	  
	        }

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
              dom_tx.appendChild(dom_namespace);                  // dom_mosaicIDをdom_txに追加                                                               
              dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く   
            })(); // async()          	  		  		  	  
          }

	    
	        if (tx.type === 16705 || tx.type === 16961){      // tx.type が 'AGGREGATE_BONDED'　または 'AGGREGATE_COMPLETE' の場合		///////////////////////////////////////////////////////////////////////////////////////////////
            (async() => {      		      
                     const aggTx = await txRepo.getTransactionsById([tx.transactionInfo.hash],sym.TransactionGroup.Confirmed).toPromise();
		                 console.log("aggTx=",aggTx[0]);

		                 if (aggTx[0].innerTransactions[0].message !== undefined){
                         dom_message.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font></br></br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[0].message.payload}</font>`;     // 　メッセージ              
                     }else
                        if (aggTx[0].innerTransactions[1].message !== undefined){
                          dom_message.innerHTML = `<font color="#FF00FF">aggTx(${aggTx[0].innerTransactions.length})　${getTransactionType(aggTx[0].innerTransactions[0].type)}</font></br></br><font color="#4169e1">< Message ></br>${aggTx[0].innerTransactions[1].message.payload}</font>`;     // メッセージ
                     }             
             // })(); // async()
		   
             
              //let mosaic_num = aggTx[0].innerTransactions[0].mosaics.length;
              //  let mosaic_num = 1;

		            /////////// モザイクが空ではない場合   /////////////////　　モザイクが空の場合はこの for 文はスルーされる  //////////
             // for(let i=0; i<mosaic_num; i++){  //モザイクの数だけ繰り返す
                //console.log("aggTx mosaic for文 (i=)",i);
                 const dom_mosaic = document.createElement('div');
                 const dom_amount = document.createElement('div');
          
               // (async() => {              
		       if (aggTx[0].innerTransactions[0].type === 16724){  // TRANSFER の場合 
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
	         }else
              if (aggTx[0].innerTransactions[0].type === 16717){ // MOSAIC_REGISTRATION の場合
                 dom_mosaicID.innerHTML = `<font color="#008b8b">Mosaic 登録 :　<big><strong>${aggTx[0].innerTransactions[0].mosaicId.id.toHex()}</strong></big></font>`; 
                 dom_tx.appendChild(dom_mosaicID);                  // dom_mosaicIDをdom_txに追加                                                        	     
	         }else{
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
           }

		           // console.log("%ci モザイクが空では無い場合の処理　iだよ　",'color: red',i);
               //  })(); // async()  
               
                dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加                                                                                           
                                   
             //   }  //モザイクの数だけ繰り返す ////////////////////////////////////////////////////////////////////////////////////
                dom_tx.appendChild(dom_message);                   // dom_message をdom_txに追加
                dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            })(); // async()  
	      
            /* if (aggTx[0].innerTransactions[0].mosaics.length === 0){   // モザイクが空の場合  //////////////　モザイクがある場合はこの if 文はスルーされる
                  const dom_mosaic = document.createElement('div');
              　　 const dom_amount = document.createElement('div');
                  
                   if(tx.recipientAddress.address !== address.address) {  // 受け取りアドレスとウォレットのアドレスが違う場合
                       dom_mosaic.innerHTML = `<font color="#FF0000">Mosaic : No mosaic</font>`;     // No mosaic
                       dom_amount.innerHTML = `<font color="#FF0000">💁‍♀️➡️💰 : </font>`;     // 　数量
                   }else{          //  受け取りアドレスとウォレットアドレスが同じ場合
         　            　 dom_mosaic.innerHTML = `<font color="#008000">Mosaic : No mosaic</font>`;     // No mosaic
                         dom_amount.innerHTML = `<font color="#008000">💰➡️😊 : </font>`;     // 　数量        
                   } 
                  　dom_tx.appendChild(dom_mosaic);                    // dom_mosaic をdom_txに追加 
                　　dom_tx.appendChild(dom_amount);                    // dom_amount をdom_txに追加
             } /////////////////////////////////////////////////////////////////////////////////////////////////////  */          		      
	        }	    
	    
            //dom_tx.appendChild(document.createElement('hr'));  // 水平線を引く
            dom_txInfo.appendChild(dom_tx);                    // トランザクション情報を追加
	    t = ++t;
    }    // tx の数だけループ処理 
  })	// txRepo.search(searchCriteria).toPromise().then((txs) =>
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
      COPY_COMPLETE.innerHTML = '　　　　<strong style="color: green;"><font size="6">Copied!</font></strong>';
  
     
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
      ).setMaxFeeForAggregate(100, 0); 
  
      window.SSS.setTransaction(aggregateTx);               // SSSにトランザクションを登録        
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
  

  console.log("Namespace=",Namespace);
  console.log("Duration=",duration);
  

  // ルートネームスペースをレンタルする
  setTimeout(() => {
      const tx = sym.NamespaceRegistrationTransaction.createRootNamespace(
          sym.Deadline.create(epochAdjustment),
          Namespace,
          sym.UInt64.fromUint(duration),
          networkType,
      ).setMaxFee(100);

      console.log("tx=",tx);

      window.SSS.setTransaction(tx);               // SSSにトランザクションを登録        
      window.SSS.requestSign().then(signedTx => {   // SSSを用いた署名をユーザーに要求
      console.log('signedTx', signedTx);
      txRepo.announce(signedTx);
      })
  }, 1000)   

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
