// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
//import { getStockInfo, clearIntervalTimer } from 'getStock.js';

import axios from 'axios';

let codeMap = new Map<string, string>();
let timerMap = new Map<string, NodeJS.Timeout>();
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {	
	
	
	let color = vscode.workspace.getConfiguration().get<string>("color");
	if (!color) {
		color = "";
	}
	const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 200);
	statusBarItem.command = 'extension.stock.off';
	statusBarItem.tooltip = '';
	statusBarItem.color = color;//"#41464b";
	context.subscriptions.push(vscode.commands.registerCommand('extension.stock', () => {
		const codes = vscode.workspace.getConfiguration().get<string>("codes");
		if (!codes) {
			return;
		}
		// 清空;
		codeMap.clear();
		timerMap.clear();
		codes.split(",").forEach((code: string, index: number, array: Array<string>) => {
			codeMap.set(code, code);
		});
		statusBarItem.show();
		statusBarItem.text = "loding...";
		codeMap.forEach((value, key) => { 
			getStockInfo(key, (codeBack: string, textBack: string) => {
				codeMap.set(codeBack, textBack);
				statusBarItem.text = tostr(codeMap);
			});
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.stock.off', () => {
		clearIntervalTimer();
		statusBarItem.text = '';
		statusBarItem.hide();
		// exec(`open 'http://quote.eastmoney.com/'`);
	}));

	// let disposable = vscode.commands.registerCommand('stock.helloWorld', () => {
	// 	// The code you place here will be executed every time your command is executed
	// 	// Display a message box to the user
	// 	vscode.window.showInformationMessage('Hello World from stock!');
	// });

	// context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

function tostr(obj: Map<string, string>) {
	let kv = "";	
	obj.forEach((value, key) => { 
		kv = kv + "  " + value;
	});
	return kv;
}



function getStockInfo(stockCode:string, callback:any) {
	const instance = axios.create();
	let updateTime = vscode.workspace.getConfiguration().get<number>('updateTime');
	if(!updateTime || updateTime < 100){
		updateTime = 1000;
	}

	let t = setInterval(() => {
		let isAllFinish = true;
		instance.get(`http://hq.sinajs.cn/list=${stockCode}`)
          .then((response) => {				
				const data =response.data;
				const dataArr = data.split('="');
				if (dataArr.length > 1) {
					const dataArr1 = dataArr[1].split(',');
					if (dataArr1.length > 3) {
						const title = dataArr1[0];
						const endPrice = dataArr1[2];
						const price = dataArr1[3];
						const rate = Math.round((price - endPrice) / endPrice * 10000) / 100;
						isAllFinish = false;
						// (12.235).toFixed(2)四舍五入						
						const text = `${parseFloat(price).toFixed(2)}  ${rate.toFixed(2)}`;
						console.log(text);
						callback(stockCode, text);
					}
				}
				if (isAllFinish) {
					callback(stockCode, 'code不存在');
					let t = timerMap.get(stockCode);
					if(t){
						clearInterval(t);
					}
				}
          })
          .catch((error) => {
            callback(stockCode, 'loading ...');
          });

	}, updateTime);

	timerMap.set(stockCode,t);
}

function clearIntervalTimer() {	
	timerMap.forEach((value, key) => { 
		let t = timerMap.get(key);
		if(t){
			clearInterval(t);
		}
	});
	// 清空;
	codeMap.clear();
	timerMap.clear();
}

