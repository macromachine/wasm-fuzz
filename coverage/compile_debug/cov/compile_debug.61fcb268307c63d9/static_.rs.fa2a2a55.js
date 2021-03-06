var data = {lines:[
{"lineNum":"    1","line":"use crate::error::GrowError;"},
{"lineNum":"    2","line":"use crate::{error::CreationError, sys, types::MemoryDescriptor, units::Pages, vm};"},
{"lineNum":"    3","line":""},
{"lineNum":"    4","line":"#[doc(hidden)]"},
{"lineNum":"    5","line":"pub const SAFE_STATIC_HEAP_SIZE: usize = 1 << 32; // 4 GiB"},
{"lineNum":"    6","line":"#[doc(hidden)]"},
{"lineNum":"    7","line":"pub const SAFE_STATIC_GUARD_SIZE: usize = 1 << 31; // 2 GiB"},
{"lineNum":"    8","line":""},
{"lineNum":"    9","line":"/// This is an internal-only api."},
{"lineNum":"   10","line":"///"},
{"lineNum":"   11","line":"/// A static memory allocates 6GB of *virtual* memory when created"},
{"lineNum":"   12","line":"/// in order to allow the WebAssembly module to contain no bounds-checks."},
{"lineNum":"   13","line":"///"},
{"lineNum":"   14","line":"/// Additionally, static memories stay at a single virtual address, so there is no need"},
{"lineNum":"   15","line":"/// to reload its address on each use."},
{"lineNum":"   16","line":"///"},
{"lineNum":"   17","line":"/// Static memories take a relatively long time to create, so if memories are short-lived,"},
{"lineNum":"   18","line":"/// it\'s recommended that a dynamic memory is used. There is currently no user-facing api that"},
{"lineNum":"   19","line":"/// allows them to select the type of memory used however."},
{"lineNum":"   20","line":"pub struct StaticMemory {"},
{"lineNum":"   21","line":"    memory: sys::Memory,"},
{"lineNum":"   22","line":"    current: Pages,"},
{"lineNum":"   23","line":"    max: Option<Pages>,"},
{"lineNum":"   24","line":"}"},
{"lineNum":"   25","line":""},
{"lineNum":"   26","line":"impl StaticMemory {"},
{"lineNum":"   27","line":"    pub(in crate::memory) fn new("},
{"lineNum":"   28","line":"        desc: MemoryDescriptor,"},
{"lineNum":"   29","line":"        local: &mut vm::LocalMemory,"},
{"lineNum":"   30","line":"    ) -> Result<Box<Self>, CreationError> {"},
{"lineNum":"   31","line":"        let memory = {"},
{"lineNum":"   32","line":"            let mut memory = sys::Memory::with_size(SAFE_STATIC_HEAP_SIZE + SAFE_STATIC_GUARD_SIZE)"},
{"lineNum":"   33","line":"                .map_err(|_| CreationError::UnableToCreateMemory)?;"},
{"lineNum":"   34","line":"            if desc.minimum != Pages(0) {"},
{"lineNum":"   35","line":"                unsafe {"},
{"lineNum":"   36","line":"                    memory"},
{"lineNum":"   37","line":"                        .protect(0..desc.minimum.bytes().0, sys::Protect::ReadWrite)"},
{"lineNum":"   38","line":"                        .map_err(|_| CreationError::UnableToCreateMemory)?;"},
{"lineNum":"   39","line":"                }"},
{"lineNum":"   40","line":"            }"},
{"lineNum":"   41","line":""},
{"lineNum":"   42","line":"            memory"},
{"lineNum":"   43","line":"        };"},
{"lineNum":"   44","line":""},
{"lineNum":"   45","line":"        let mut storage = Box::new(StaticMemory {"},
{"lineNum":"   46","line":"            memory,"},
{"lineNum":"   47","line":"            current: desc.minimum,"},
{"lineNum":"   48","line":"            max: desc.maximum,"},
{"lineNum":"   49","line":"        });"},
{"lineNum":"   50","line":"        let storage_ptr: *mut StaticMemory = &mut *storage;"},
{"lineNum":"   51","line":""},
{"lineNum":"   52","line":"        local.base = storage.memory.as_ptr();"},
{"lineNum":"   53","line":"        local.bound = desc.minimum.bytes().0;"},
{"lineNum":"   54","line":"        local.memory = storage_ptr as *mut ();"},
{"lineNum":"   55","line":""},
{"lineNum":"   56","line":"        Ok(storage)"},
{"lineNum":"   57","line":"    }"},
{"lineNum":"   58","line":""},
{"lineNum":"   59","line":"    /// The size of this memory in `Pages`."},
{"lineNum":"   60","line":"    pub fn size(&self) -> Pages {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   61","line":"        self.current","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   62","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   63","line":""},
{"lineNum":"   64","line":"    /// Try to grow this memory by the given number of delta pages."},
{"lineNum":"   65","line":"    pub fn grow(&mut self, delta: Pages, local: &mut vm::LocalMemory) -> Result<Pages, GrowError> {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   66","line":"        if delta == Pages(0) {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   67","line":"            return Ok(self.current);","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   68","line":"        }"},
{"lineNum":"   69","line":""},
{"lineNum":"   70","line":"        let new_pages = self.current.checked_add(delta).map_err(|e| e.into())?;","class":"lineNoCov","hits":"0","possible_hits":"5",},
{"lineNum":"   71","line":""},
{"lineNum":"   72","line":"        if let Some(max) = self.max {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   73","line":"            if new_pages > max {","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   74","line":"                return Err(GrowError::ExceededMaxPagesForMemory(","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   75","line":"                    new_pages.0 as usize,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   76","line":"                    max.0 as usize,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   77","line":"                ));"},
{"lineNum":"   78","line":"            }"},
{"lineNum":"   79","line":"        }"},
{"lineNum":"   80","line":""},
{"lineNum":"   81","line":"        let _ = unsafe {","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   82","line":"            self.memory","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   83","line":"                .protect("},
{"lineNum":"   84","line":"                    self.current.bytes().0..new_pages.bytes().0,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   85","line":"                    sys::Protect::ReadWrite,","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   86","line":"                )"},
{"lineNum":"   87","line":"                .map_err(|e| e.into())","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   88","line":"        }?;","class":"lineNoCov","hits":"0","possible_hits":"3",},
{"lineNum":"   89","line":""},
{"lineNum":"   90","line":"        local.bound = new_pages.bytes().0;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   91","line":""},
{"lineNum":"   92","line":"        let old_pages = self.current;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   93","line":""},
{"lineNum":"   94","line":"        self.current = new_pages;","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   95","line":""},
{"lineNum":"   96","line":"        Ok(old_pages)","class":"lineNoCov","hits":"0","possible_hits":"1",},
{"lineNum":"   97","line":"    }","class":"lineNoCov","hits":"0","possible_hits":"2",},
{"lineNum":"   98","line":""},
{"lineNum":"   99","line":"    /// Get this memory represented as a slice of bytes."},
{"lineNum":"  100","line":"    pub fn as_slice(&self) -> &[u8] {"},
{"lineNum":"  101","line":"        unsafe { &self.memory.as_slice()[0..self.current.bytes().0] }"},
{"lineNum":"  102","line":"    }"},
{"lineNum":"  103","line":""},
{"lineNum":"  104","line":"    /// Get this memory represented as a mutable slice of bytes."},
{"lineNum":"  105","line":"    pub fn as_slice_mut(&mut self) -> &mut [u8] {"},
{"lineNum":"  106","line":"        unsafe { &mut self.memory.as_slice_mut()[0..self.current.bytes().0] }"},
{"lineNum":"  107","line":"    }"},
{"lineNum":"  108","line":"}"},
]};
var percent_low = 25;var percent_high = 75;
var header = { "command" : "compile_debug", "date" : "2019-11-28 11:37:30", "instrumented" : 23, "covered" : 0,};
var merged_data = [];
