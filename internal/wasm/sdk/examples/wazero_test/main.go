// Copyright 2020 The OPA Authors.  All rights reserved.
// Use of this source code is governed by an Apache2
// license that can be found in the LICENSE file.
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path"

	"github.com/tetratelabs/wazero"
)

// main demonstrates the loading and executing of OPA produced wasm
// policy binary. To execute run 'go run main.go .' in the directory
// of the main.go.

func _builtin0(ctx context.Context, id, _ctx int32) int32 {
	fmt.Printf("%d:%d", id, _ctx)
	return 0
}

func _builtin1(ctx context.Context, id, _ctx, arg1 int32) int32 {
	fmt.Printf("%d:%d:%d", id, _ctx, arg1)
	return 0
}

func _builtin2(ctx context.Context, id, _ctx, arg1, arg2 int32) int32 {
	fmt.Printf("%d:%d:%d:%d", id, _ctx, arg1, arg2)
	return 0
}

func _builtin3(ctx context.Context, id, _ctx, arg1, arg2, arg3 int32) int32 {
	fmt.Printf("%d:%d:%d:%d:%d", id, _ctx, arg1, arg2, arg3)
	return 0
}

func _builtin4(ctx context.Context, id, _ctx, arg1, arg2, arg3, arg4 int32) int32 {
	fmt.Printf("%d:%d:%d:%d:%d:%d", id, _ctx, arg1, arg2, arg3, arg4)
	return 0
}

func _builtinAbort(ctx context.Context, ptr int32) {
	var r wazero.Runtime = ctx.Value("runtime").(wazero.Runtime)
	data, _ := r.Module("env").ExportedMemory("memory").ReadByte(uint32(ptr))
	r.Module("env").ExportedMemory("memory")
	idx := 0
	for data != 0b00 {
		idx++
		data, _ = r.Module("env").ExportedMemory("memory").ReadByte(uint32(ptr) + uint32(idx))
	}

	outp, _ := r.Module("env").ExportedMemory("memory").Read(uint32(ptr), uint32(idx))
	fmt.Printf("%s\n", string(outp[:]))

	log.Panic("abort", 0)
}

func _builtinPrintln(ctx context.Context, id int32) {
	fmt.Printf("%d", id)
}

func _dumpJson(r wazero.Runtime, addr int32) {
	r.Module("env")
}

func main() {
	if len(os.Args) < 2 {
		fmt.Printf("%s: first argument must a path to a directory with example-1.wasm and example-2.wasm.\n", os.Args[0])
		return
	}

	directory := os.Args[1]

	// Setup the SDK

	policy, err := os.ReadFile(path.Join(directory, "example-1.wasm"))
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	wenv, err := os.ReadFile(path.Join(directory, "env.wasm"))
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}

	ctx := context.Background()
	r := wazero.NewRuntime(ctx)
	ctx = context.WithValue(ctx, "runtime", r)
	_, err = r.NewHostModuleBuilder("host").
		NewFunctionBuilder().WithFunc(_builtinAbort).Export("builtin_abort").
		NewFunctionBuilder().WithFunc(_builtinPrintln).Export("builtin_println").
		NewFunctionBuilder().WithFunc(_builtin0).Export("builtin0").
		NewFunctionBuilder().WithFunc(_builtin1).Export("builtin1").
		NewFunctionBuilder().WithFunc(_builtin2).Export("builtin2").
		NewFunctionBuilder().WithFunc(_builtin3).Export("builtin3").
		NewFunctionBuilder().WithFunc(_builtin4).Export("builtin4").
		Instantiate(ctx)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	fmt.Printf("aaaaa\n")
	_, err = r.InstantiateWithConfig(ctx, wenv, wazero.NewModuleConfig().WithName("env"))
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	fmt.Printf("aaaaa\n")
	mod, err := r.Instantiate(ctx, policy)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	entry, _ := mod.ExportedFunction("entrypoints").Call(ctx)
	print(entry)
	addr, err := mod.ExportedFunction("opa_eval").Call(
		ctx,
		0,
		0,
		0,
		0,
		0,
		0,
		0)
	if err != nil {
		fmt.Printf("error: %v\n", err)
		return
	}
	data, _ := r.Module("env").ExportedMemory("memory").ReadByte(uint32(addr[0]))
	r.Module("env").ExportedMemory("memory")
	idx := 0
	for data != 0b00 {
		idx++
		data, _ = r.Module("env").ExportedMemory("memory").ReadByte(uint32(addr[0]) + uint32(idx))
	}

	outp, _ := r.Module("env").ExportedMemory("memory").Read(uint32(addr[0]), uint32(idx))
	fmt.Printf("%s\n", string(outp[:]))

	fmt.Printf("aaaaa")
}
